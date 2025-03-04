// src/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Order } from '../orders/entities/order.entity';
import { OrdersProducts } from '../orders/entities/orders-product.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrdersProducts, Product, Category]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}