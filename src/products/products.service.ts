import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>
  ) {}

  async create(createProductDto: CreateProductDto, file: any) {
    const filePath = join('./uploads', file.filename);
    try {
      const {name, description, categories} = createProductDto;
      
      const createdCategories = await this.categoryRepository.find({where: { id: In(categories)}})

      if (createdCategories.length !== categories.length) throw new Error('No se encontraron todas las categorias');
      
      const text = {
        name,
        description,
        imagen: filePath,
        createdCategories
      }

      const newProduct = this.productRepository.create(text)

      console.log(newProduct);

      await this.productRepository.save(newProduct)
      return newProduct
    
    } catch (error) {
      if (!error.errno) throw new BadRequestException(`${error.message}`);
      
      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  findAll() {    // return `This action returns all products`;
    return this.productRepository.find({
      relations: ['categories']
    })


  }

  async findOne(id: number) {    // return `This action returns a #${id} product`;

    const productFound = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: ['categories']
    });
  
    if (!productFound) throw new BadRequestException(`Product id ${id} does not exists`)
  
    return productFound;
  }

  async update(id: number, product: UpdateProductDto) { 
    try{
      const {  name, description, categoriesIds} = product
      console.log(categoriesIds);
      const productFound = await this.productRepository.findOne({
        where: {
            id,
        },
      });
  
      if (!productFound) throw new HttpException(`Product id ${id} not found`, HttpStatus.NOT_FOUND)
  
      if(name) productFound.name = name;
  
      if(description) productFound.description = description;
  
      if (categoriesIds) {
        
        const updatedCategories = await this.categoryRepository.find({where: { id: In(categoriesIds)}});
        
        if (categoriesIds.length !== updatedCategories.length){ 
          throw new HttpException('No se encontraron todas las categorias', HttpStatus.NOT_FOUND)
         }
  
        productFound.categories = updatedCategories; //asigna nuevas categorias al producto 
      }
  
      return this.productRepository.save(productFound);
      
    } catch (error) {
      if (!error.errno) throw new BadRequestException(error.message);
      // throw new InternalServerErrorException('Something terrible happen!');
    }
  }// fin async update

  async delete(id: number) {    // return `This action removes a #${id} product`;
    
    const productFound = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: ['categories']
    });
    
    if (!productFound) throw new HttpException('Product not found',HttpStatus.NOT_FOUND)

    return this.productRepository.delete({ id });

  }

}//fin 