import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto{

  @IsNotEmpty({message: 'category name can not be empty'})
  @IsString({message: 'category name should be string.'})
  categoryName: string

}