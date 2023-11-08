import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { Roles } from "../interfaces";

export class UpdateUserDto {

  @IsEmail()
  @IsOptional()
  email: string; 

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @MinLength(6)
  @IsOptional()
  password: string;

  @IsEnum(Roles)
  @IsOptional()
  rol?: Roles;

}