import { Category } from "src/categories/category.entity";
import { PriceHistory } from "src/price_history/price_history.entity";
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

  @OneToMany(() => PriceHistory, (price_history) => price_history.product)
  price: PriceHistory[];
}
