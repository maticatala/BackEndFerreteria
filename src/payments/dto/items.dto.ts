import { IsNumber, IsString } from "class-validator";

//DTO de lineas de pedido
export class ItemsDto {

    @IsString()
    id: string;

    @IsString()
    title: string;

    @IsNumber()
    quantity:   number;

    @IsNumber()
    unit_price: number;

}