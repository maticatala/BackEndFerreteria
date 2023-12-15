import { Category } from "src/categories/category.entity";
import { Pedido } from "src/pedidos/entities/pedido.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";


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

  @Column({ default: false })
  isDeleted: boolean;
  
  @Column({type: 'decimal' , precision: 10, scale: 2, default: 0.0})
  price: number;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: 'products_categories',
    joinColumn: {
      name: 'product_id'
    },
    inverseJoinColumn: {
      name: 'category_id'
    }
  })
  categories: Category[];


  @ManyToMany(() => Pedido,(pedido) => pedido.products)
  pedidos:  Pedido[];
}
