import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class LoginDto {

  @IsNotEmpty({message: 'Email can not be empty.'})
  @IsEmail({},{message: 'Please provide a valid email'})
  email: string;
  
  @IsNotEmpty({message: 'Password can not be empty.'})
  @MinLength(6, {message: 'Password minimun character should be 6.'})
  password: string;

  // @IsBoolean()
  @IsNotEmpty({message: 'keepLogged can not be empty.'})
  keepLogged: boolean;

}