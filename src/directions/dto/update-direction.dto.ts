import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectionDto } from './create-direction.dto';
import { ArrayMinSize, IsArray, IsOptional } from 'class-validator';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

export class UpdateDirectionDto extends PartialType(CreateDirectionDto) {

    @IsArray()
    @IsOptional()
    usersId?:number[]

    @IsArray()
    @ArrayMinSize(0)
    pedidosIds: Pedido[]

}
