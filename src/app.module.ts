import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { dataSourceOptions } from '../db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { MailsModule } from './mails/mails.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
// import { RolesModule } from './roles/roles.module copy';


@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    OrdersModule,
    MailsModule,
    AuthModule,
    UsersModule,
    // RolesModule,
  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  configure(consumer:MiddlewareConsumer) {
    consumer
    .apply(CurrentUserMiddleware)
    .forRoutes({path:'*',method:RequestMethod.ALL});

  }


}
