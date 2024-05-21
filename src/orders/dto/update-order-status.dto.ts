import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "../enums/order-status.enum";

export class UpdateOrderStatusDto{
    @IsNotEmpty()
    @IsString()
    //Valida que el estado del pedido sea SHIPPED o DELIVERED
    @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
    status:OrderStatus;
}