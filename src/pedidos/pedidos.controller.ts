import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';


const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    const finalFileName = `${name}-${randomName}${extension}`;
    const filePath = join('./uploads', finalFileName); // Ruta completa al archivo
    cb(null, finalFileName); // Guarda el archivo con el nombre final
  },
});


@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}
 
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  create(@Body() createProductDto: CreatePedidoDto, @UploadedFile() file) {
    return this.pedidosService.create(createProductDto, file);
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


