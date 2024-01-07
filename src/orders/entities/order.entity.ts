import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { Shipping } from "./shipping.entity";
import { OrdersProducts } from "./orders-product.entity";

@Entity({name: 'orders'})
export class Order {

  @PrimaryGeneratedColumn()
  public id:number;

  @CreateDateColumn()
  public orderAt: Date;

  @Column({type: "enum", enum:OrderStatus, default: OrderStatus.PROCESSING})
  public status: string
  
  @Column({nullable: true})
  public shippedAt: Date;

  @Column({nullable: true})
  public deliveredAt: Date;

  @ManyToOne((type) => User, (user) => user.ordersUpdateBy)
  updatedBy: User;

  @OneToOne((type) => Shipping, (shipping) => shipping.order, { cascade: true })
  @JoinColumn()
  shippingAddress: Shipping;

  @OneToMany((type) => OrdersProducts, (orderProduct) => orderProduct.order, { cascade: true })
  products: OrdersProducts[];

  @ManyToOne((type) => User, user => user.orders)
  user: User;
}