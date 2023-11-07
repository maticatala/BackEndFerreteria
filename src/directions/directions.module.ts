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
import { AuthController } from 'src/auth/auth.controller';
import { PedidosController } from 'src/pedidos/pedidos.controller';
import { AuthService } from 'src/auth/auth.service';
@Module({
  imports:[
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Direction, Pedido, Product]),
  ],
  controllers: [DirectionsController, AuthController, PedidosController],
  providers: [DirectionsService,PedidosService, AuthService]
})
export class DirectionsModule {}
