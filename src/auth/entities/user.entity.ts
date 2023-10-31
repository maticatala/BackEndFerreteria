import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../interfaces";
import { Exclude } from "class-transformer";

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

}