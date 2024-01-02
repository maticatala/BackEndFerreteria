import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/auth/interfaces';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoryService: CategoriesService){}

  @Get()
  getCategories(): Promise<Category[]>{
    return this.categoryService.findAll()
  }
    
  @Get(':id')
  getCategory(@Param('id') id: string): Promise<Category>{
    return this.categoryService.findOne(+id)
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  createCategory(@Body() newCategory: CreateCategoryDto, @CurrentUser() currentUser: User): Promise<Category>{
    return this.categoryService.createCategory(newCategory, currentUser)
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category>{
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  delete(@Param('id') id: string): Promise<Category>{
    return this.categoryService.delete(+id);
  }

}