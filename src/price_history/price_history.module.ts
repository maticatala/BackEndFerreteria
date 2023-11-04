import { Module } from '@nestjs/common';
import { PriceHistoryService } from './price_history.service';
import { PriceHistoryController } from './price_history.controller';
import { PriceHistory } from './price_history.entity';
import { Product } from 'src/products/entities/product.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([PriceHistory]),
    TypeOrmModule.forFeature([Product])],
  providers: [PriceHistoryService],
  controllers: [PriceHistoryController]
})
export class PriceHistoryModule {}
