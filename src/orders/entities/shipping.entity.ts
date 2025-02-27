import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity({ name: 'shippings' })
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({default:' '})
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postCode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  //Un pedido tiene una unica dirección de entrega y una dirección de entrega pertenece a un único pedido
  @OneToOne((type) => OrderEntity, order => order.shippingAddress)
  order: OrderEntity;
}