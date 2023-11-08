import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { Exclude } from "class-transformer";

export class RegisterDto {

  @IsEmail()
  email: string;

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @MinLength(6)
  password: string;
}