import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { Shipping } from "./shipping.entity";
import { OrdersProducts } from "./orders-product.entity";
import { PaymentEntity } from "./payment.entity";
import { UserEntity } from "src/users/entities/user.entity";

@Entity({name: 'orders'})
export class OrderEntity {

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

  @ManyToOne((type) => UserEntity, (user) => user.orders)
  updatedBy: UserEntity;

  @ManyToOne((type) => UserEntity, (user) => user.id)
  addedBy: UserEntity;

  //cascade true ya que al eliminar un pedido tambien eliminaremos su direccion de entrega
  @OneToOne((type) => Shipping, (shipping) => shipping.order, { cascade: true })
  @JoinColumn()
  shippingAddress: Shipping;

  //Un pedido debe tener una o mas lineas de pedido
  @OneToMany((type) => OrdersProducts, (orderProduct) => orderProduct.order, { cascade: true })
  products: OrdersProducts[];

  @ManyToOne((type) => UserEntity, user => user.orders)
  User: UserEntity;

  @OneToMany((type) => PaymentEntity, (payment) => payment.order, { cascade: true })
  payments: PaymentEntity[];
}