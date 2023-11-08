import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/category.entity';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Product, Category, Pedido]),

  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
