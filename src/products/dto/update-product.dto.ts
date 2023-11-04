import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    // @IsString()          no hacen falta, vienen del extends
    // name?: string;
    
    // @IsString()
    // description?: string;
  
    @IsArray()
    @IsOptional()
    categoriesIds?: number[]
  
}
