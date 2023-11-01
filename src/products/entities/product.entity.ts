import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'products'}) //Lo rojito va en MINUSCULA
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  description: string;

  @Column()
  imagen: string;
}
