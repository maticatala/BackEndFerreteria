import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Module({
  imports:[
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Pedido]),
  ],
  controllers: [DirectionsController],
  providers: [DirectionsService],
})
export class DirectionsModule {}
