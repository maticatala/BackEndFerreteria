import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductResponse } from './interfaces/product-response.interface';
import { User } from 'src/auth/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService
  ) { }

  async create(createProductDto: CreateProductDto, file: any, currentUser: User): Promise<Product> {
    try {
      const { categoriesIds } = createProductDto;

      const createdCategories = await await this.categoryService.getCategoriesByIds(categoriesIds);
      
      let newProduct = this.productRepository.create(createProductDto);

      // console.log(newProduct);

      newProduct.addedBy = currentUser;
      newProduct.categories = createdCategories;
      newProduct.imagen = file.filename;
      newProduct.isDeleted = false;
      
      newProduct = await this.productRepository.save(newProduct);
      
      console.log(newProduct);

      delete newProduct.isDeleted;
      
      return newProduct;
    
    } catch (error) {
      if (error.status === 404) return error.response;

      console.log(error)
      
      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async findAll(): Promise<ProductResponse[]> {    // return `This action returns all products`;
    const products = await this.productRepository.find({
      where: { isDeleted: false },
      relations: {
        categories: true,
        addedBy: true
      },
      select: {
        categories: {
          id: true,
          categoryName: true
        },
        addedBy: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
        }
      }
    });

    return products;
  }

  async findOne(id: number) {    // return `This action returns a #${id} product`;
    const product = await this.productRepository.findOne({
      where: {
        id: id,
        isDeleted: false
      },
      relations: {
        categories: true,
        addedBy: true
      },
      select: {
        categories: {
          id: true,
          categoryName: true
        },
        addedBy: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
        }
      }
    })

    if (!product) throw new NotFoundException(`Product id #${id} does not exists`)

    return product;
  }

  async update(id: number, updateProductDto: Partial<UpdateProductDto>, file: any): Promise<ProductResponse> { 
    try{
      const productFound = await this.findOne(id);

      const { categoriesIds } = updateProductDto
  
      if (categoriesIds) {
        productFound.categories = await this.categoryService.getCategoriesByIds(categoriesIds);
      }

      if (file) productFound.imagen = file.filename;

      this.productRepository.merge(productFound, updateProductDto);
      
      return await this.productRepository.save(productFound);
      
    } catch (error) {
      if (error.status === 404) return error.response;

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async delete(id: number): Promise<ProductResponse> {  
    try {
      let productFound = await this.findOne(id);
  
      productFound.isDeleted = true;
  
      return await this.productRepository.save(productFound);
    } catch (error) {
      if (error.status === 404) return error.response;

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

}//fin