import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Transaction } from 'src/payments/entities/transactions.entity';

@Entity({ name: 'shippings' })
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ default: ' ' })
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

  // Relación OneToOne con Order
  @OneToOne(() => Order, (order) => order.shippingAddress)
  order: Order;

  // Relación OneToOne con Transaction
  @OneToOne(() => Transaction, (transaction) => transaction.shipping)
  transaction: Transaction;
}
