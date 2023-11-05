import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Pedido } from 'src/pedidos/entities/pedido.entity';
import { Direction } from './entities/direction.entity';
import { PedidosService } from 'src/pedidos/pedidos.service';
import { Product } from 'src/products/entities/product.entity';
@Module({
  imports:[
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Direction]),
    TypeOrmModule.forFeature([Pedido]),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [DirectionsController],
  providers: [DirectionsService,PedidosService]
})
export class DirectionsModule {}
