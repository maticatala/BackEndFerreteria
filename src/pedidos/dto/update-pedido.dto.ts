import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {


}
