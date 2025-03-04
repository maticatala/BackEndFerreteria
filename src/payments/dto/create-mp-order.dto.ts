import { ValidateNested } from "class-validator";
import { ItemMP } from "../interface/item-mp.interface";
import { CreateShippingDto } from "src/orders/dto/create-shipping.dto";
import { Type } from "class-transformer";
import { ItemsDto } from "./items.dto";

export class CreateMpOrderDto {

    @Type(() => ItemsDto) // <- Esto también
    @ValidateNested() // <- Esto es importante
    items: ItemMP[]

    @Type(() => CreateShippingDto)
    @ValidateNested()
    shippingAddress: CreateShippingDto;

}
