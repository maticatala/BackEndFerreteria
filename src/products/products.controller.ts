import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Query, ParseFilePipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from "path";

  const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null,Date.now() + '_' +  file.originalname);
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
  getFile(@Res() res: Response, @Query('fileName') fileName: string) {
    // res.sendFile(path.join(__dirname, "../../uploads/" + file.fileName));
    res.sendFile(path.join(__dirname, "../../uploads/" + fileName));
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage }))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFile(new ParseFilePipe({ fileIsRequired: false })) file?) {
    return this.productsService.update(+id, updateProductDto, file);
  }

  @Patch('delete/:id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }
}
