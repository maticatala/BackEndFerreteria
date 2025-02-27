import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChangeRoleDto {

    @IsNumber()
    @IsNotEmpty()
    roleId: number;

    @IsString()
    @IsNotEmpty()
    userId: string;

    
}