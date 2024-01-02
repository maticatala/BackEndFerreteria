import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService as OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdatePedidoDto } from './dto/update-order.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
 
  @UseGuards(AuthenticationGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: User) {
    return this.ordersService.create(createOrderDto, currentUser);
  } 

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') nroPedido: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.ordersService.update(+nroPedido, updatePedidoDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ordersService.delete(+id);
  }
}


