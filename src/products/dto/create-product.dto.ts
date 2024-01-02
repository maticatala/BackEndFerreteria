import { IsString, IsArray, IsOptional, IsNumber, IsPositive, IsNotEmpty} from "class-validator";

export class CreateProductDto {

  @IsNotEmpty({message: 'name can not be blank.'})
  @IsString({message: 'name should be string'})
  readonly name: string;
  
  @IsNotEmpty({message: 'name can not be empty.'})
  @IsString({message: 'description should be string'})
  readonly description: string;

  @IsNotEmpty({message: 'price can not be empty.'})
  @IsNumber({ maxDecimalPlaces: 2 }, {message: 'price should be number & max decimal precission 2.'})
  @IsPositive({message: 'price should be positive number.'})
  readonly price: number;

  @IsOptional()
  readonly isDeleted: boolean;

  @IsNotEmpty({message: "categories id's can not be empty."})
  @IsArray({message: "categories id's should be in array format."})
  readonly categoriesIds: number[];

}