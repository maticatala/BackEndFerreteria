import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/auth/entities/user.entity';
import { Pedido } from 'src/pedidos/entities/pedido.entity';
import { Direction } from './entities/direction.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Direction, Pedido, Product]),
  ],
  controllers: [DirectionsController],
  providers: [ DirectionsService]
})
export class DirectionsModule {}
