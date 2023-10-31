import { IsNumber, IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
  
  @IsNumber()
  @IsPositive()
  @IsOptional()
  pageSize: number;
  
  
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page: number;
  
}
