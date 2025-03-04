import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

//DTO de lineas de pedido
export class ItemsDto {

    @IsString()
    id: string;

    @IsString()
    title: string;

    @IsNumber()
    unit_price: number;

    @IsNumber()
    quantity:   number;

    @IsString()
    currency_id: string;

}