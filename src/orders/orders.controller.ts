import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrdersService as OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Order } from './entities/order.entity';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/auth/interfaces';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
 
  //Para crear un pedido necesitamos la direccion y los productos que se quieren pedir
  @UseGuards(AuthenticationGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: User): Promise<Order> {
    return this.ordersService.create(createOrderDto, currentUser);
 } 

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get('/userOrders')
  getUserOrders(@CurrentUser() currentUser: User){
    return this.ordersService.getUserOrders(currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/userOrder/:id')
  getUserOrderById(@Param('id') id: string, @CurrentUser() currentUser: User): Promise<Order> {
    return this.ordersService.getUserOrderById(+id, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto, @CurrentUser() currentUser: User) {
    return this.ordersService.update(+id, updateOrderStatusDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Put('payments/:id')
  updatePayment(@Param('id') id: string, @Body() updatePaymentStatusDto: UpdatePaymentStatusDto, @CurrentUser() currentUser: User) {
    return this.ordersService.updatePayment(+id, updatePaymentStatusDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Put('cancel/:id')
  cancelled(@Param('id') id: string, @CurrentUser() currentUser: User){
    return this.ordersService.cancelled(+id, currentUser);
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async deleteOrder(
    @Param('id') id: number,
    @CurrentUser() currentUser: User,
  ) {
    return await this.ordersService.deleteOrder(id);
  }
}


