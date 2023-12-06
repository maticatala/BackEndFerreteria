import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { FileParams } from './interfaces/file-params.interface';
import * as path from "path";

  const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    // const name = file.originalname.split('.')[0];
    // const extension = extname(file.originalname);
    // const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    // const finalFileName = `${name}-${randomName}${extension}`;
    // const filePath = join('./uploads', finalFileName); // Ruta completa al archivo
    // cb(null, finalFileName); // Guarda el archivo con el nombre final
    cb(null, file.originalname + '_' + Date.now());
  },
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() file) {
    return this.productsService.create(createProductDto, file);
  } 

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get("/getFile")
  getFile(@Res() res: Response, @Body() file: FileParams) {
    res.sendFile(path.join(__dirname, "../../uploads/" + file.fileName));
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage }))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file) {
    return this.productsService.update(+id, updateProductDto, file);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }
}
