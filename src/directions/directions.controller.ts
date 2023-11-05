import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';


const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    const finalFileName = `${name}-${randomName}${extension}`;
    const filePath = join('./uploads', finalFileName); // Ruta completa al archivo
    cb(null, finalFileName); // Guarda el archivo con el nombre final
  },
});
@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  create(@Body() CreateDirectionDto: CreateDirectionDto, @UploadedFile() file) {
    return this.directionsService.create(CreateDirectionDto, file);
  } 

  @Get()
  findAll() {
    return this.directionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDirectionDto: UpdateDirectionDto) {
    return this.directionsService.update(+id, updateDirectionDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.directionsService.delete(+id);
  }
}
