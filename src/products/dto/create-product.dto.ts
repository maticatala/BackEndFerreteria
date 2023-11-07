import { IsString, ArrayMinSize, IsArray} from "class-validator";
import { Category } from "src/categories/category.entity";

export class CreateProductDto {
  @IsString()
  name: string;
  
  @IsString()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  categoriesIds: number[]

}