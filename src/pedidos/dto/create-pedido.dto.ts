import { ArrayMinSize, IsArray, IsDate, IsNumber, IsString } from "class-validator";
import { Direction } from "readline";
import { User } from "src/auth/entities/user.entity";
import { Product } from "src/products/entities/product.entity";

export class CreatePedidoDto {
    
    @IsDate()
    fechaPedido:Date;

    @IsDate()
    fechaEntrega:Date;

    @IsArray()
    @ArrayMinSize(1)
    productsIds: number[];

    @IsNumber()
    directionId: number;

    @IsNumber()
    userId: number;

}
