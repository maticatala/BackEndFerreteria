import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {

  constructor(private categoryService: CategoriesService){}

  @Get()
  getCategories(){
    return this.categoryService.getCategories()
  }

  @Post()
  createCategory(@Body() newCategory: CreateCategoryDto){
    console.log(newCategory)
    return this.categoryService.createCategory(newCategory)
  }
  
}
