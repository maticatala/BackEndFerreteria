import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { SortOrder } from "../interfaces/sort-order.enum";


export class QueryProductDto {
  
  @IsNumber()
  public page: number = 1;
  
  @IsNumber()
  public pageSize: number;
  
  @IsOptional()
  public orderBy?: string = 'id';
  
  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
  
  @IsString()
  @IsOptional()
  public name: string;

  @IsNumber()
  @IsOptional()
  public category: number;
}