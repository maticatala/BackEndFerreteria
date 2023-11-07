import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/auth/entities/user.entity";
import { Pedido } from "src/pedidos/entities/pedido.entity";
 
export class CreateDirectionDto {

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


}

    

