import { Type } from 'class-transformer';
import {
    ArrayUnique,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

export class CreateRoleDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Permission)
  permissions: Permission[];
  
}

export class Permission {
  @IsEnum(Resource)
  resource: Resource;

  @IsEnum(Action, { each: true })
  @ArrayUnique()
  actions: Action[];
}