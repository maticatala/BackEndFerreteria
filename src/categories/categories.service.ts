import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>){}

  async createCategory(category: CreateCategoryDto){
    try {

      const newCategory = this.categoryRepository.create(category);
    
      return await this.categoryRepository.save(newCategory);

    } catch (error) {

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }
  
  async getCategories(){
     return await this.categoryRepository.find()
  }

  async getCategoryById(id: number) {
    return  await this.searchCategory(id);

  }
  
  //TODO: delete y update

  async delete(id: number) {    // return `This action removes a #${id} category`;
    const categoryFound = await this.searchCategory(id);

    return this.categoryRepository.remove(categoryFound);
  }


  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const categoryFound = await this.searchCategory(id);

      this.categoryRepository.merge(categoryFound, updateCategoryDto);

      return this.categoryRepository.save(categoryFound);
    } catch (error) {
      if (!error.errno) throw new BadRequestException(error.message);

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  
  //PRIVATE METHODS

  private async searchCategory(categoryId: number): Promise<Category> {
    const categoryFound = await this.categoryRepository.findOne({
      where: { id: categoryId }
    });

    if (!categoryFound) throw new NotFoundException(`Category ${categoryId} does not exists!`);

    return categoryFound;
  }


}