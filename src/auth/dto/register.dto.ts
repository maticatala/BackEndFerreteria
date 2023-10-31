import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { Exclude } from "class-transformer";

export class RegisterDto {

  @IsEmail()
  email: string;

  @IsString()
  name: string

  @MinLength(6)
  password: string;
}