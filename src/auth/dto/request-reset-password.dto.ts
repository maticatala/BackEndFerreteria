import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestResetPasswordDto {
    @IsNotEmpty({ message: 'El email no puede estar vacio' })
    @IsEmail({}, { message: 'El email ingresado no es valido' })
    email: string;
}