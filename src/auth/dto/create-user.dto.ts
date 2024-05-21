import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Roles } from "../interfaces";

export class CreateUserDto {

  @IsNotEmpty({message: 'Email can not be empty.'})
  @IsEmail({},{message: 'Please provide a valid email'})
  email: string; 

  @IsNotEmpty({message: 'First name can not be empty.'})
  @IsString({message: 'First name should be string'})
  firstName: string;

  @IsNotEmpty({message: 'Last name can not be empty.'})
  @IsString({message: 'Last name should be string'})
  lastName: string;

  @IsNotEmpty({message: 'Password can not be empty.'})
  @MinLength(6, {message: 'Password minimun character should be 6.'})
  password: string;

  @IsEnum(Roles)
  @IsOptional()
  rol: Roles;
}