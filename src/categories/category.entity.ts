import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

//import {} from 
//Importar products

@Entity({name: 'categories'})
export class Category{

  @PrimaryGeneratedColumn()
  id: number

  @Column({unique: true})
  categoryName: string

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

}