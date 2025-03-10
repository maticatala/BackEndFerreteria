import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async createCategory(category: CreateCategoryDto, file: any, currentUser: User): Promise<Category>{
    try {

      const newCategory = this.categoryRepository.create(category);

      newCategory.addedBy = currentUser;
      newCategory.imagen = file.filename;
      newCategory.isDeleted = false;

      return await this.categoryRepository.save(newCategory);

    } catch (error) {

      if (error.errno === 1062) {
        throw new BadRequestException(`the name ${category.categoryName} is aleady in use`);
      }

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }
  
  async findAll(): Promise<Category[]>{
    return await this.categoryRepository.find(
      {
       relations: {
          addedBy: true
        },
        select: {
          addedBy: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      })
  }
  
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne(
      {
        where: {
          id: id
        },
        relations: {
          addedBy: true
        },
        select: {
          addedBy: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
      );

      if (!category) throw new NotFoundException(`Category id #${id} does not exists`);
      
      return category;
  }

    
  async findOneByName(name: string): Promise<Category> {
    const category = await this.categoryRepository.findOne(
      {
        where: {
          categoryName: name
        },
        relations: {
          addedBy: true
        },
        select: {
          addedBy: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
      );
      
      return category;
  }
  
    async getCategoriesByIds(categoryIds: number[]): Promise<Category[]> {
  
      const categoryFound = await this.categoryRepository.find({
        where: { id: In(categoryIds) }
      });
  
      if (categoryFound.length !== categoryIds.length)
        throw new NotFoundException('Not all categories found');
  
      return categoryFound;
    }


    //Podria implementarse la baja logica (atributo isDelete ya existente)
    async delete(id: number): Promise<Category> {    // return `This action removes a #${id} category`;
    try {
      const categoryFound = await this.findOne(id);

      return this.categoryRepository.remove(categoryFound);
    } catch (error) {
      if (error.status === 404) return error.response;

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async update(id: number, fields: Partial<UpdateCategoryDto>, file: any): Promise<Category> {
    try {    
      const categoryFound = await this.findOne(id);
     
      if (categoryFound.categoryName !== fields.categoryName) {
        const category = await this.findOneByName(fields.categoryName);
        if (category) throw new BadRequestException(`the name ${category.categoryName} is aleady in use`) 
      }
      
      if (fields.description) categoryFound.description = fields.description;
      if (file) categoryFound.imagen = file.filename;
      
      this.categoryRepository.merge(categoryFound, fields);

      return this.categoryRepository.save(categoryFound);

    } catch (error) {

      if (error instanceof BadRequestException) throw error

      if (error.status === 404) return error.response;

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

}