import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { PaymentStatus } from "../enums/payment-status.enum";

export class UpdatePaymentStatusDto{
    @IsNotEmpty()
    @IsString()
    @IsIn([PaymentStatus.COMPLETED, PaymentStatus.FAILED, PaymentStatus.REFUNDED])
    status:PaymentStatus;
}