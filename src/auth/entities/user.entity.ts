import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Direction } from "src/directions/entities/direction.entity";
import { Roles } from "../interfaces";
import { Pedido } from "src/pedidos/entities/pedido.entity";

@Entity({ name: 'users' })
export class User {

  //TODO: implementar UUID en vez de un numero auto incremental
  //* Establece el id como auto incremental
  @PrimaryGeneratedColumn()
  id: number;

  //* Por defecto crea las columnas con atributo not null
  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column()
  name: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'enum', enum: Roles, default: Roles.user})
  rol: Roles;

  @OneToMany(() => Direction, (directions) => directions.id)
  directions: Direction[];

  @OneToMany(() => Pedido, (pedidos) => pedidos.nroPedido)
  pedidos: Pedido[];
}

