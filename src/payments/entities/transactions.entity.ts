import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shipping } from '../../orders/entities/shipping.entity';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  // Relación OneToOne con Shipping
  @OneToOne(() => Shipping, (shipping) => shipping.transaction, { cascade: true })
  @JoinColumn()
  shipping: Shipping;
}
