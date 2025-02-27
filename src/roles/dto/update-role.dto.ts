import { PartialType } from "@nestjs/mapped-types";
import { CreateRoleDto, Permission } from "./role.dto";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UpdateRoleDto  {
    
    @IsString()
    name: string;

    @ValidateNested()
    @Type(() => Permission)
    permissions: Permission[];

}
