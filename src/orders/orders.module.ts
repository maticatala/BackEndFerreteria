import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersProducts } from './entities/orders-product.entity';
import { Shipping } from './entities/shipping.entity';
import { OrderEntity } from './entities/order.entity';
import { ProductsModule } from 'src/products/products.module';
import { PaymentEntity } from './entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([OrderEntity, OrdersProducts, Shipping, PaymentEntity]),
    ProductsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
