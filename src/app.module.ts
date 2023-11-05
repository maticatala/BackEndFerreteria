import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { PriceHistoryModule } from './price_history/price_history.module';
import { DirectionsModule } from './directions/directions.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'fau1234sql',
      database: 'ecommerce',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    AuthModule,
    CategoriesModule,
    ProductsModule,
    PriceHistoryModule,
    DirectionsModule,
    PedidosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
