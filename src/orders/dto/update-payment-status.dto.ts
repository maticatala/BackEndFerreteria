import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { PaymentStatus } from "../enums/payment-status.enum";

export declare type TransactionData = {
    transactionId: string,
    status: string
}

export class UpdatePaymentStatusDto{


    transactionId?: string;

    @IsNotEmpty()
    @IsString()
    @IsIn([PaymentStatus.COMPLETED, PaymentStatus.FAILED, PaymentStatus.REFUNDED, PaymentStatus.APPROVED, PaymentStatus.PENDING])
    status:PaymentStatus;
}