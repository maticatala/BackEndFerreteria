import { ArrayMinSize, IsArray, IsDate, IsNumber, IsString } from "class-validator";
import { Direction } from "readline";
import { User } from "src/auth/entities/user.entity";
import { Product } from "src/products/entities/product.entity";

export class CreatePedidoDto {
    @IsNumber()
    nroPedido:number;

    @IsDate()
    fechaPedido:Date;

    @IsDate()
    fechaEntrega:Date;

    @IsArray()
    @ArrayMinSize(1)
    products: Product[];

    idDire:Direction;

    id:User;

}
