import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/category.entity';

@Module({
  imports:[
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Category]),
    
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
