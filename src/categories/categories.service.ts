import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>){}

  async createCategory(category: CreateCategoryDto){
    const categoryFound = await this.categoryRepository.findOne({
      where: ({
        categoryName : category.categoryName
      })
    })

    if(categoryFound){
      return new HttpException('Category already exists', HttpStatus.CONFLICT)
    }

    const newCategory = this.categoryRepository.create(category)
    return this.categoryRepository.save(newCategory)

  }
  
  async getCategories(){
     return this.categoryRepository.find()
  }

  // Se filtra en el front
  // async getCategoryById(id: number){
  //   const categoryFound = await this.categoryRepository.findOne({
  //     where: ({
  //       id
  //     })
  //   })

  //   if(!categoryFound){
  //     return new HttpException('Category not found', HttpStatus.NOT_FOUND)
  //   }

  //   return categoryFound

  // }


}
