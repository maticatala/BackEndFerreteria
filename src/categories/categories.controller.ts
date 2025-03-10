import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/auth/interfaces';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from "path";

  const storage = diskStorage({ // Multer options -> se esta definiendo una configuracion de almacenamiento para multer
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null,Date.now() + '_' +  file.originalname);
    },
  });

@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoryService: CategoriesService){}

  @Get()
  getCategories(): Promise<Category[]>{
    return this.categoryService.findAll()
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Promise<Category>{
    return this.categoryService.findOne(+id)
  }

  @Get("file/get") // error al hacerlo como en productos (ver y unificar). Toma "getfile" como id y ejecuta la peticion get anterior
  getFile(@Res() res: Response, @Query('fileName') fileName: string) {
    res.sendFile(path.join(__dirname, "../../../uploads/" + fileName));
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  createCategory(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file, @CurrentUser() currentUser: User): Promise<Category>{
    return this.categoryService.createCategory(createCategoryDto, file, currentUser)
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage }))
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile(new ParseFilePipe({ fileIsRequired: false })) file?): Promise<Category>{
    return this.categoryService.update(+id, updateCategoryDto, file);
  }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  delete(@Param('id') id: string): Promise<Category>{
    return this.categoryService.delete(+id);
  }

}