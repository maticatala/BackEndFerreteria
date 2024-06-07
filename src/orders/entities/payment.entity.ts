import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "../enums/payment-status.enum";

@Entity({ name: 'payments' })
export class Payment {
      //* Establece el id como auto incremental
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentType: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: string;

  @Column({default: null})
  transactionId: string;

  @CreateDateColumn()
  paymentDate: Date;

  @ManyToOne(() => Order, order => order.payments)
  order: Order;
}
