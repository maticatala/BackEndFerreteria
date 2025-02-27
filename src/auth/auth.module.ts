import { UserEntity } from 'src/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ValidatorService } from './validator.service';
// import { RolesModule } from 'src/roles/roles.module copy';


@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Configuración del módulo ConfigModule para cargar las variables de entorno
    TypeOrmModule.forFeature([UserEntity, OrderEntity]), // ✅ Registro de entidades de TypeORM

    //* Configuración asíncrona del JWT (Json Web Token)
    JwtModule.registerAsync({
      imports: [ConfigModule], // ✅ Importa ConfigModule para usar ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'), // ✅ Clave desde .env
        // signOptions: { expiresIn: '30d' }, // ✅ Opciones de firma, expira en 30 días
      }),
      inject: [ConfigService], // ✅ Inyecta ConfigService en useFactory
    }),

    // RolesModule, // ✅ Importa RolesModule
  ],
  controllers: [AuthController], // ✅ Controladores del módulo
  providers: [AuthService, ValidatorService], // ✅ Proveedores del módulo
  exports: [AuthService, ValidatorService], // ✅ Exporta servicios para su uso en otros módulos
})
export class AuthModule {}