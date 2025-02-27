import { IsNotEmpty, IsUUID } from "class-validator";

export class ActivateUserDto {

    @IsNotEmpty()
    @IsUUID('4')
    activationUsertoken: string;

    @IsNotEmpty()
    password: string;

}