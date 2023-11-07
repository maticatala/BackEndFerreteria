import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}
 
  @Post()
  create(@Body() createProductDto: CreatePedidoDto) {
    return this.pedidosService.create(createProductDto);
  } 

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(+id, updatePedidoDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pedidosService.delete(+id);
  }
}


