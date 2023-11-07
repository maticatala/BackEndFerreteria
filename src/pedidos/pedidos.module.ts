import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direction } from 'src/directions/entities/direction.entity';
import { User } from 'src/auth/entities/user.entity';
import { Pedido } from './entities/pedido.entity';
import { DirectionsService } from 'src/directions/directions.service';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Direction, Pedido, Product]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService, DirectionsService],
})
export class PedidosModule {}
