import { ArrayMinSize, IsArray, IsNumber, IsString } from "class-validator";
import { User } from "src/auth/entities/user.entity";
import { Pedido } from "src/pedidos/entities/pedido.entity";
 
export class CreateDirectionDto {

    @IsNumber()
    idDire: number;

    @IsString()
    codigoPostal: string;

    @IsString()
    provincia: string;

    @IsString()
    localidad: string;

    @IsString()
    calle: string;

    @IsString()
    numero: string;

    @IsString()
    pisoDepto: string;

    @IsArray()
    @ArrayMinSize(0)
    pedidos: Pedido[]

    id: number;
}

    

