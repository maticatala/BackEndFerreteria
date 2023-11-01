import { Body, Controller, Get, Param, ParseEnumPipe, ParseIntPipe, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {

  constructor(private categoryService: CategoriesService){}

  @Get()
  getCategories(){
    return this.categoryService.getCategories()
  }
  
  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) id: number){
    return this.categoryService.getCategoryById(id)
  }

  @Post()
  createCategory(@Body() newCategory: CreateCategoryDto){
    console.log(newCategory)
    return this.categoryService.createCategory(newCategory)
  }
  
}
