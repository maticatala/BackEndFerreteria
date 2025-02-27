import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @Length(3, 50)
    firstName: string;

    @IsString()
    @IsOptional()
    @Length(3, 50)
    lastName: string;
}