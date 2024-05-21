import { User } from "src/auth/entities/user.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'categories'})
export class Category{

  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true})
  categoryName: string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, user => user.categories)
  addedBy: User;

  @ManyToMany((type) => Product, (product) => product.categories)
  products: Product[];

}