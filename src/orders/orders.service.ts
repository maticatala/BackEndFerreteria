import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdatePedidoDto } from './dto/update-order.dto';
import { User } from 'src/auth/entities/user.entity';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersProducts } from './entities/orders-product.entity';
import { Shipping } from './entities/shipping.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrdersProducts) private readonly opRepository: Repository<OrdersProducts>,
  ) {}

  async create(createOrderDto: CreateOrderDto, currentUser: User) {
    try {
      const shippingEntity = new Shipping();
      Object.assign(shippingEntity, createOrderDto.shippingAddress);

      const orderEntity = new Order();
      orderEntity.shippingAddress = shippingEntity;
      orderEntity.user = currentUser;

      const order = await this.orderRepository.save(orderEntity);

      let opEntity: {
        orderId: number,
        productId: number,
        product_quantity: number,
        product_unit_price: number
      }[] = []
      
      for (let i = 0; i < createOrderDto.orderedProducts.length; i++){
        const orderId = order.id;
        const productId = createOrderDto.orderedProducts[i].id;
        const product_quantity = createOrderDto.orderedProducts[i].product_queantity;
        const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;
        opEntity.push({ orderId, productId, product_quantity, product_unit_price });
      }

      const op = await this.opRepository
        .createQueryBuilder()
        .insert()
        .into(OrdersProducts)
        .values(opEntity)
        .execute();

      return await this.findOne(order.id);
    } catch (error) {
      
    }

  }

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
        }
      }
    })
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  delete(arg0: number) {
    throw new Error('Method not implemented.');
  }
  update(arg0: number, updatePedidoDto: UpdatePedidoDto) {
    throw new Error('Method not implemented.');
  }

}