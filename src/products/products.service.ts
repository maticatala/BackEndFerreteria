import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    try {
      const {categoriesIds} = createProductDto;
      
      const createdCategories = await this.searchCategories(categoriesIds);
      
      const newProduct = this.productRepository.create(createProductDto);

      newProduct.categories = createdCategories;

      newProduct.imagen = file.filename;

      return await this.productRepository.save(newProduct)
    
    } catch (error) {
      if (!error.errno) throw new BadRequestException(`${error.message}`);
      
      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async findAll() {    // return `This action returns all products`;
    return await this.productRepository.find({
      relations: ['categories']
    })
  }

  async findOne(id: number) {    // return `This action returns a #${id} product`;

    return await this.searchProduct(id);

  }

  async update(id: number, updateProductDto: UpdateProductDto, file: any) { 
    
    let filePath
    console.log(file);
    if (file){
      filePath = join('./uploads', file.filename);
    }
    try{
      const { categoriesIds } = updateProductDto
      
      const productFound = await this.searchProduct(id);
  
      if (categoriesIds) {
        productFound.categories = await this.searchCategories(categoriesIds);
      }
      if (file){
      productFound.imagen = filePath;
      }
      this.productRepository.merge(productFound, updateProductDto);

      return await this.productRepository.save(productFound);
      
    } catch (error) {
      if (!error.errno) throw new BadRequestException(error.message);
      // throw new InternalServerErrorException('Something terrible happen!');
    }
  }// fin async update

  async delete(id: number) {  // return `This action removes a #${id} product`;
 
    await this.searchProduct(id);
    return this.productRepository.delete({ id });

  }

  //PRIVATE METHODS
  private async searchProduct(productId: number): Promise<Product> {
    const productFound = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['categories']
    });

    if (!productFound) throw new NotFoundException(`Category ${productId} does not exists!`);

    return productFound;
  }

  private async searchCategories(categoryIds: number[]): Promise<Category[]> {

    const categoryFound = await this.categoryRepository.find({
      where: { id: In(categoryIds) }
    });

    if (categoryFound.length !== categoryIds.length)
      throw new NotFoundException('Not all categories found');

    return categoryFound;
  }

}//fin