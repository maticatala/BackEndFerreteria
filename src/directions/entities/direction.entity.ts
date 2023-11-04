//import { Direction } from "src/directions/direction.entity";

import internal from "stream";
import  {User} from "src/auth/entities/user.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";



@Entity({name: 'directions'})
export class Direction {
    @PrimaryGeneratedColumn()
    idDire: number;

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
    pisoDepto:string;
    
    @ManyToOne(()=> User, (users) => users.idDire)
    id: User;
}
