import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersProducts } from './entities/orders-product.entity';
import { Shipping } from './entities/shipping.entity';
import { Order } from './entities/order.entity';
import { ProductsModule } from 'src/products/products.module';
import { Payment } from './entities/payment.entity';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Order, OrdersProducts, Shipping, Payment]),
    ProductsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
