import { User } from "src/auth/entities/user.entity";
import { Category } from "src/categories/entities/category.entity";
import { OrdersProducts } from "src/orders/entities/orders-product.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({name: 'products'})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  imagen: string;

  @Column({ default: false, select: false })
  isDeleted: boolean;
  
  @Column({type: 'decimal' , precision: 10, scale: 2, default: 0.0})
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, user => user.products)
  addedBy: User;

  @ManyToMany((type) => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @OneToMany((type) => OrdersProducts, (ordersProducts) => ordersProducts.product)
  orders: OrdersProducts[];
}
