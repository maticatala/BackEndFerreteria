import { IsNotEmpty, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsUUID('4')
  resetPasswordToken: string;

  @IsNotEmpty()
  password: string;
}
