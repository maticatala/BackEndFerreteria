import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>){}

  async createCategory(category: CreateCategoryDto){
    try {
      const newCategory = this.categoryRepository.create(category);
      await this.categoryRepository.save(newCategory);
      return newCategory; 

    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException(`${category.categoryName} alredy exists!`);
      }
      throw new InternalServerErrorException('Something terrible happen!');
    }
  }
  
  async getCategories(){
     return this.categoryRepository.find()
  }

  async getCategoryById(id: number){
    const categoryFound = await this.categoryRepository.findOne({
      where: ({
        id
      })
    });

    if(!categoryFound) throw new BadRequestException(`category id ${id} does not exist`);

    return categoryFound;

  }


}
