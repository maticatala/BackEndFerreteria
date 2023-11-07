import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Post(':id')
  createDirection(@Param('id', ParseIntPipe) id: number, @Body() CreateDirectionDto: CreateDirectionDto) {
    return this.directionsService.createDirection(id, CreateDirectionDto);
  } 

  @Get()
  findAll() {
    return this.directionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directionsService.findOne(+id);
  }

  @Get('/directions/:id')
  findAllByUserId(@Param('id', ParseIntPipe) userId: number) {
    return this.directionsService.findAllByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDirectionDto: UpdateDirectionDto) {
    return this.directionsService.update(+id, updateDirectionDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: string) {
    return this.directionsService.delete(+id);
  }
}
