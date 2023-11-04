import { IsNumber, IsObject } from "class-validator";
import { Product } from "src/products/entities/product.entity";

export class CreatePriceDto {
   
    @IsNumber()
    price: number;
    
    @IsNumber()
    product: Product;
  
  }