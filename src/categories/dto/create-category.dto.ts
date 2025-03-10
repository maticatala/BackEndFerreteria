import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto{

  @IsNotEmpty({message: 'category name can not be empty'})
  @IsString({message: 'category name should be string.'})
  categoryName: string

  @IsNotEmpty({message: 'name can not be empty.'})
  @IsString({message: 'description should be string'})
  readonly description: string;

  @IsOptional()
  readonly isDeleted: boolean;
}