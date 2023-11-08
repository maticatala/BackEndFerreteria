//import { Direction } from "src/directions/direction.entity";

import internal from "stream";
import  {User} from "src/auth/entities/user.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "src/pedidos/entities/pedido.entity";
import { IsOptional } from "class-validator";
import { Status } from "../interfaces/status.enum";



@Entity({name: 'directions'})
export class Direction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigoPostal: string;

    @Column()
    provincia:string;

    @Column()
    localidad:string;

    @Column()
    calle:string;

    @Column()
    numero:string;

    @Column({nullable: true})
    @IsOptional()
    pisoDepto:string;


    @Column({ type: 'enum', enum: Status, default: Status.active})
    isActive: Status;

    @ManyToOne(()=> User, (users) => users.directions)
    user: User;

    @OneToMany(() => Pedido, (pedidos) => pedidos.direction )
    pedidos: Pedido[];


}
