import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Direction } from 'src/directions/entities/direction.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports:[
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Direction]),
    
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
