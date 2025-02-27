import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forFeature([User, Order]),
    //* Configuracion del JWT (Json Web Token), secret obtiene la llave secreta que tenemos en el archivo .env para crear "encriptar" el JWT, signOption indica duración que tiene el JWT, en este caso, expira a las 6 horas,es una medida de seguridad.
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}