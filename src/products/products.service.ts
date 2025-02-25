import { Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Like, Repository } from 'typeorm';
import { ProductResponse } from './interfaces/product-response.interface';
import { User } from 'src/auth/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoriesService
  ) { }

  async create(createProductDto: CreateProductDto, file: any, currentUser: User): Promise<Product> {
    try {
      const { categoriesIds } = createProductDto; // desestructuración

      const createdCategories = await this.categoryService.getCategoriesByIds(categoriesIds);

      let newProduct = this.productRepository.create(createProductDto); 

      newProduct.addedBy = currentUser;
      newProduct.categories = createdCategories;
      newProduct.imagen = file.filename;
      newProduct.isDeleted = false;

      newProduct = await this.productRepository.save(newProduct);

      delete newProduct.isDeleted;

      return newProduct;

    } catch (error) {
      if (error.status === 404) return error.response;
      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async findAll(): Promise<ProductResponse[]> { // return `This action returns all products`;   
    const products = await this.productRepository.find({
      // take: query.limit,
      where: { 
        isDeleted: false, 
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
        },
      },
      // order:{
      //   [query.order] : 'ASC',
      // },
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

  async searchProductByQueryParams(@Query() query: QueryProductDto) {
    let whereCondition: any = {
      isDeleted: false
    };

    if (query.name) {
      whereCondition.name = Like(`%${query.name}%`);
    }

    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.addedBy', 'user')
      .leftJoinAndSelect('product.categories', 'allCategories') // Incluir todas las categorías del producto
      .where(whereCondition);

    if (query.category) {
        queryBuilder = queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: query.category,
      });
    }

    const [result, total] = await queryBuilder
      .orderBy(`product.${query.orderBy}`, query.sortOrder)
      .take(query.pageSize)
      .skip((query.page - 1) * query.pageSize)
      .getManyAndCount();

    const remainingItems = total - (query.page - 1) * query.pageSize;
    const itemCount = remainingItems > query.pageSize ? query.pageSize : remainingItems;
    const totalPages = Math.ceil(total / query.pageSize);

    return {
      data: result,
      meta: {
        totalItems: total,
        itemCount,
        itemsPerPage: query.pageSize,
        totalPages,
        currentPage: query.page
      }
    };
  }

}//fin