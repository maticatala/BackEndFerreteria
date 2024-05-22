import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { PaymentStatus } from '../enums/payment-status.enum';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'Payment type cannot be empty.' })
  @IsString({ message: 'Payment type must be a string.' })
  paymentType: string;

  @IsNotEmpty({ message: 'Amount cannot be empty.' })
  @IsNumber({}, { message: 'Amount must be a number.' })
  amount: number;

  @IsNotEmpty({ message: 'Currency cannot be empty.' })
  @IsString({ message: 'Currency must be a string.' })
  currency: string;

  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Status must be a valid payment status.' })
  status: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: Date;
}
