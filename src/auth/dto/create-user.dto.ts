import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { Roles } from "../interfaces";

export class CreateUserDto {
  
  @IsEmail()
  email: string; 
  
  @IsString()
  name: string;
  
  @MinLength(6)
  password: string;

  @IsEnum(Roles)
  rol?: Roles;

}