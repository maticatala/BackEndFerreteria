import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/auth/entities/user.entity';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersProducts } from './entities/orders-product.entity';
import { Shipping } from './entities/shipping.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';
import { Payment } from './entities/payment.entity';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { error } from 'console';
import { CreateMpOrderDto } from 'src/payments/dto/create-mp-order.dto';
import { PaymentsService } from 'src/payments/payments.service';
// import { CreateOrderDto2 } from './dto/create-order2.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrdersProducts) private readonly opRepository: Repository<OrdersProducts>,
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    private readonly productService: ProductsService
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: User) {
    try {
      const shippingEntity = new Shipping();
      Object.assign(shippingEntity, createOrderDto.shippingAddress);

      const orderEntity = new Order();
      orderEntity.shippingAddress = shippingEntity;
      orderEntity.user = currentUser;

            // Crear las entidades de pago y asignarlas a la orden
      const paymentEntities = createOrderDto.payments.map(paymentDto => {
        const payment = new Payment();
        Object.assign(payment, paymentDto);
        payment.order = orderEntity; // Asocia el pago con la orden
        return payment;
      });
      orderEntity.payments = paymentEntities;

      const order = await this.orderRepository.save(orderEntity);

      //Arreglo de lineas de pedido
      let opEntity: {
        order: Order,
        product: Product,
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
  // async updatePayment2(
  //   orderId: number,
  //   updatePaymentStatusDto: { transactionId: string; status: string },
  // ) {
  //   const order = await this.orderRepository.findOne({
  //     where: { id: orderId },
  //     relations: ['payments'],
  //   });
  //   if (!order) {
  //     throw new NotFoundException('Order not found');
  //   }
  
  //   // Suponiendo que actualizamos el primer payment (o buscás el correspondiente)
  //   const paymentToUpdate = order.payments[0];
  //   paymentToUpdate.transactionId = updatePaymentStatusDto.transactionId;
  //   paymentToUpdate.status = updatePaymentStatusDto.status;
  //   await this.orderRepository.save(order);
  //   return order;
  // }

// ------------------------------------------------
async updatePayment(
  id: number,
  updatePaymentStatusDto: UpdatePaymentStatusDto,
  currentUser: User
) {
  console.log("updatePaymentStatusDto",updatePaymentStatusDto);
  let payment = await this.paymentRepository.findOne({
    where: { id },
    relations: { order: true }
  });

  if (!payment) {
    throw new NotFoundException('Payment not found');
  }

  payment.transactionId = updatePaymentStatusDto.transactionId;
  payment.status = updatePaymentStatusDto.status;
  payment = await this.paymentRepository.save(payment);



  if (payment.order) {
    payment.order.updatedBy = currentUser;
    if( payment.status !== 'approved' && payment.status !== 'pending'){
      payment.order.status = OrderStatus.CANCELLED
    } 
    await this.orderRepository.save(payment.order);
  }

  return payment;
}
//--------------------------------------------------------------
  // async updatePayment(id: number, updatePaymentStatusDto: UpdatePaymentStatusDto, currentUser: User) {
  //   let payment = await this.paymentRepository.findOne({
  //     where: {
  //       id
  //     },
  //     relations: {
  //       order: true
  //     }
  //   });

  //   payment.status = updatePaymentStatusDto.status
  //   payment = await this.paymentRepository.save(payment);

  //   payment.order.updatedBy = currentUser;
  //   await this.orderRepository.save(payment.order);

  //   return payment;
  // }
  
  // async createOrderMp(createOrderDto: CreateOrderDto, currentUser: User) {
  //   try {
  //     const shippingEntity = new Shipping();
  //     Object.assign(shippingEntity, createOrderDto.shippingAddress);

  //     const orderEntity = new Order();
  //     orderEntity.shippingAddress = shippingEntity;
  //     orderEntity.user = currentUser;
      
  //     const payment = new Payment();
  //     payment.paymentType = "MP";
  //     payment.amount = 0;
  //     payment.currency = "ARS";
  //     payment.status = "PENDING";
  //     payment.order = orderEntity; // Asocia el pago con la orden

  //     const payments = [payment];

  //     console.log('pasando payments');

  //     orderEntity.payments = payments;

  //     const order = await this.orderRepository.save(orderEntity);

  //     //Arreglo de lineas de pedido
  //     let opEntity: {
  //       order: Order,
  //       product: Product,
  //       product_quantity: number,
  //       product_unit_price: number
  //     }[] = []
      
  //     //Llena el arreglo utilizando el DTO de orderedProducts
  //     for (let i = 0; i < createOrderDto.orderedProducts.length; i++){
  //       const product = await this.productService.findOne(createOrderDto.orderedProducts[i].id)
  //       const product_quantity = createOrderDto.orderedProducts[i].product_quantity;
  //       const product_unit_price = product.price;
  //       opEntity.push({ order, product, product_quantity, product_unit_price });
  //     }

  //     //Crea la linea de pedido
  //     const op = await this.opRepository
  //       .createQueryBuilder()
  //       .insert()
  //       .into(OrdersProducts)
  //       .values(opEntity)
  //       .execute();

  //     // return await this.paymentsService.createOrder(order);
      
  //     return await this.findOne(order.id);
  //   } catch (error) {
  //     console.error('Error creating order:', error);
  //     throw error; // O puedes lanzar una excepción personalizada
  //   }
  // }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where: {
        id
      },
      relations: {
        shippingAddress: true,
        user: true,
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
        user: true,
        products: {
          product: true
        },
        payments: true
      }
    })
  }

  async getUserOrders(currentUser: User) {
    try {
      const orders = await this.orderRepository.find({
        where: {user: {
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

  async getUserOrderById(id: number, currentUser: User) {
    try {
      const order = await this.orderRepository.findOne({
        where: {
          id,
          user: {
            id: currentUser.id
          }
        },
        relations: {
          shippingAddress: true,
          user: true,
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
  
  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto, currentUser: User) {
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

  async cancelled(id: number, currentUser: User){
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

  // async deleteOrder(id: number) {
  //   const order = await this.findOne(id);

  //   if(!order) throw new NotFoundException('Order not found');

  //SE HACE CON EL REPOSITORIO DE ORDER PRODUCTS


  //   return await this.orderRepository.delete(id);

  // }

}