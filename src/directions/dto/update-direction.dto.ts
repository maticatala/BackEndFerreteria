import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectionDto } from './create-direction.dto';
import { ArrayMinSize, IsArray, IsNumber, IsOptional } from 'class-validator';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

export class UpdateDirectionDto extends PartialType(CreateDirectionDto) {

    @IsNumber()
    @IsOptional()
    userId: number

    @IsArray()
    @IsOptional()
    pedidosIds: Pedido[]

}
