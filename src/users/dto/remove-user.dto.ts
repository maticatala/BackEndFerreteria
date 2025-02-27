import { IsNotEmpty, IsString } from "class-validator";

export class RemoveUserDto {
    @IsString()
    @IsNotEmpty()
    password: string
}