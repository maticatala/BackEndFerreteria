import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersProducts } from './entities/orders-product.entity';
import { Shipping } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';
import { PaymentEntity } from './entities/payment.entity';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { error } from 'console';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProducts) private readonly opRepository: Repository<OrdersProducts>,
    @InjectRepository(PaymentEntity) private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly productService: ProductsService
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    try {
      const shippingEntity = new Shipping();
      Object.assign(shippingEntity, createOrderDto.shippingAddress);

      const orderEntity = new OrderEntity();
      orderEntity.shippingAddress = shippingEntity;
      orderEntity.User = currentUser;

            // Crear las entidades de pago y asignarlas a la orden
      const paymentEntities = createOrderDto.payments.map(paymentDto => {
        const payment = new PaymentEntity();
        Object.assign(payment, paymentDto);
        payment.order = orderEntity; // Asocia el pago con la orden
        return payment;
      });
      orderEntity.payments = paymentEntities;

      const order = await this.orderRepository.save(orderEntity);

      //Arreglo de lineas de pedido
      let opEntity: {
        order: OrderEntity,
        product: ProductEntity,
        product_quantity: number,
        product_unit_price: number
      }[] = []
      
      //Llena el arreglo utilizando el DTO de orderedProducts
      for (let i = 0; i < createOrderDto.orderedProducts.length; i++){
        const product = await this.productService.findOne(createOrderDto.orderedProducts[i].id)
        const product_quantity = createOrderDto.orderedProducts[i].product_quantity;
        const product_unit_price = product.price;
        opEntity.push({ order, product, product_quantity, product_unit_price });
      }

      //Crea la linea de pedido
      const op = await this.opRepository
        .createQueryBuilder()
        .insert()
        .into(OrdersProducts)
        .values(opEntity)
        .execute();

  
      return await this.findOne(order.id);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error; // O puedes lanzar una excepción personalizada
    }

  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: {
        id
      },
      relations: {
        shippingAddress: true,
        User: true,
        products: {
          product: true
        },
        payments: true
      }
    })
  }
  
  async findAll() {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        User: true,
        products: {
          product: true
        },
        payments: true
      }
    })
  }

  async getUserOrders(currentUser: UserEntity) {
    try {
      const orders = await this.orderRepository.find({
        where: {User: {
          id: currentUser.id
        }},
        relations: ['shippingAddress', 'products', 'payments']
      });

      if(orders.length === 0) throw new Error();
  
      return orders;
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener los pedidos del usuario');
    }
  }

  async getUserOrderById(id: number, currentUser: UserEntity) {
    try {
      const order = await this.orderRepository.findOne({
        where: {
          id,
          User: {
            id: currentUser.id
          }
        },
        relations: {
          shippingAddress: true,
          User: true,
          products: {
            product: true
          },
          payments: true
        }
      })

      if (!order) throw new Error();

      return order;
    } catch (error) {
      throw new Error('Error al obtener el pedido del usuario');
    }
  }

  async updatePayment(id: number, updatePaymentStatusDto: UpdatePaymentStatusDto, currentUser: UserEntity) {
    let payment = await this.paymentRepository.findOne({
      where: {
        id
      },
      relations: {
        order: true
      }
    });

    payment.status = updatePaymentStatusDto.status
    payment = await this.paymentRepository.save(payment);

    payment.order.updatedBy = currentUser;
    await this.orderRepository.save(payment.order);

    return payment;
  }
  
  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');

    //El pedido fue entregado o cancelado.
    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED){
      throw new BadRequestException(`The order has already been  ${order.status}`)
    }

    //Pedido en proceso y actualiza el estado a enviado
    if (order.status === OrderStatus.PROCESSING && updateOrderStatusDto.status !== OrderStatus.SHIPPED){
      throw new BadRequestException(`Order delivered before being shipped!!!`)
    }

    //Pedido enviado y actualiza el estado a enviado
    if (order.status === OrderStatus.SHIPPED && updateOrderStatusDto.status === OrderStatus.SHIPPED){
      return order;
    }

    //Si actualiza el estado a enviado guarda la fecha
    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    //Si actualiza el estado a entregado guarda la fecha
    if(updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    return order;
  }

  async cancelled(id: number, currentUser: UserEntity){
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException('Order not found');

    if (order.status === OrderStatus.DELIVERED){
      throw new BadRequestException(`The order has already been ${order.status}`)
    }

    if (order.status === OrderStatus.CANCELLED) {
      return order;
    }
    
    order.status = OrderStatus.CANCELLED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    return order;
  }

}