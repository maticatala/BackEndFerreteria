import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Roles } from "../interfaces";
import { Order } from "src/orders/entities/order.entity";
import { Category } from "src/categories/entities/category.entity";
import { Product } from "src/products/entities/product.entity";

@Entity({ name: 'users' })
export class User {

  //* Establece el id como auto incremental
  @PrimaryGeneratedColumn()
  id: number;

  //* Por defecto crea las columnas con atributo not null
  @Column({ unique: true })
  email: string;

  @Column({ select: false})
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER})
  rol: Roles;

  @Column({ type: 'uuid', unique: true, nullable: true, name: 'reset_password_token' })
  resetPasswordToken: string;

  @OneToMany((type) => Category, category => category.addedBy)
  categories: Category[];

  @OneToMany((type) => Product, product => product.addedBy)
  products: Category[];

  @OneToMany((type) => Order, (order) => order.updatedBy)
  ordersUpdateBy: Order[];

  @OneToMany((type) => Order, (orders) => orders.user)
  orders: Order[];
}

