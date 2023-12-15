import { IsString, ArrayMinSize, IsArray, IsOptional, IsDecimal, IsNumber, IsPositive} from "class-validator";

export class CreateProductDto {
  @IsString()
  readonly name: string;
  
  @IsString()
  readonly description: string;

  @IsArray()
  @ArrayMinSize(1)
  readonly categoriesIds: number[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  readonly price: number;

  @IsOptional()
  readonly isDeleted: boolean;
}