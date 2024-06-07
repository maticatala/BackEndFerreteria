import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { Shipping } from "./shipping.entity";
import { OrdersProducts } from "./orders-product.entity";
import { Payment } from "./payment.entity";

@Entity({name: 'orders'})
export class Order {

  @PrimaryGeneratedColumn()
  public id:number;

  @Column({type: "enum", enum:OrderStatus, default: OrderStatus.PROCESSING})
  public status: string

  //Pedido el ...
  @CreateDateColumn()
  public orderAt: Date;
  
  //Enviado el ...
  @Column({nullable: true})
  public shippedAt: Date;

  //Entregado el ...
  @Column({nullable: true})
  public deliveredAt: Date;

  @ManyToOne((type) => User, (user) => user.ordersUpdateBy)
  updatedBy: User;

  //cascade true ya que al eliminar un pedido tambien eliminaremos su direccion de entrega
  @OneToOne((type) => Shipping, (shipping) => shipping.order, { cascade: true })
  @JoinColumn()
  shippingAddress: Shipping;

  //Un pedido debe tener una o mas lineas de pedido
  @OneToMany((type) => OrdersProducts, (orderProduct) => orderProduct.order, { cascade: true })
  products: OrdersProducts[];

  @ManyToOne((type) => User, user => user.orders)
  user: User;

  @OneToMany((type) => Payment, (payment) => payment.order, { cascade: true })
  payments: Payment[];
}