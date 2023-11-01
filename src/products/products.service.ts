import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>
  ) {}
  async create(createProductDto: CreateProductDto, file: any) {
    const filePath = join('./uploads', file.filename);
    try {
      const {name, description} = createProductDto;
      const text = {
        name,
        description,
        imagen: filePath
      }
      const newProduct = this.productRepository.create(text)
      await this.productRepository.save(newProduct)
      return newProduct
    } catch (error) {
        throw new InternalServerErrorException('Ocurrió lo peor, no tuvimos clases')
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
