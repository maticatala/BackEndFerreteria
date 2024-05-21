import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

//DTO de lineas de pedido
export class OrderedProductsDto {

  //ID del producto
  @IsNotEmpty({message: 'Product can not be empty.'})
  @IsNumber()
  id: number;

  //Precio unitario del producto
  // @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price should be number & max decimal precission 2.' })
  // @IsPositive({message: 'Price can not be negative.'})
  // product_unit_price: number;

  //Cantidad del producto
  @IsNumber({}, { message: 'Quantity should be number.' })
  @IsPositive({message: 'Quantity can not be negative.'})
  product_quantity: number;
}