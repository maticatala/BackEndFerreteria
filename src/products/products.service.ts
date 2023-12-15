import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import { ProductResponse } from './interfaces/product-response.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>
  ) {}

  async create(createProductDto: CreateProductDto, file: any) {
    try {
      const { categoriesIds } = createProductDto;
      
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

  async findAll(): Promise<ProductResponse[]> {    // return `This action returns all products`;
    const products = await this.productRepository.find({
      where: { isDeleted: false },
      relations: ['categories']
    });

    // Mapear los productos y eliminar el atributo isDeleted de cada uno
    const productsResponse = products.map(product => {
      const { isDeleted, ...productWithoutDeletedFlag } = product;
      return productWithoutDeletedFlag;
    });

    return productsResponse;
  }

  async findOne(id: number) {    // return `This action returns a #${id} product`;

    return await this.searchProduct(id);

  }

  async update(id: number, updateProductDto: UpdateProductDto, file: any): Promise<ProductResponse> { 
    try{
      const { categoriesIds } = updateProductDto

      const productFound = await this.searchProduct(id);
  
      if (categoriesIds) {
        productFound.categories = await this.searchCategories(categoriesIds);
      }

      if (file) productFound.imagen = file.filename;

      this.productRepository.merge(productFound, updateProductDto);

      const { isDeleted, ...productResponse } = productFound;
      
      return await this.productRepository.save(productResponse);
      
    } catch (error) {
      if (!error.errno) throw new BadRequestException(error.message);
      // throw new InternalServerErrorException('Something terrible happen!');
    }
  }// fin async update

  async delete(id: number): Promise<ProductResponse> {  
 
    const product = await this.searchProduct(id);

    product.isDeleted = true;
    
    await this.productRepository.save(product);

    const { isDeleted, ...productResponse } = product;

    return productResponse;

  }

  //PRIVATE METHODS
  private async searchProduct(productId: number): Promise<Product> {
    const productFound = await this.productRepository.findOne({
      where: { id: productId, isDeleted: false },
      relations: ['categories']
    });

    if (!productFound) throw new NotFoundException(`Product ${productId} does not exists!`);

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