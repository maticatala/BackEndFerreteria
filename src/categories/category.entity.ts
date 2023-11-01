import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

//import {} from 
//Importar products

@Entity({name: 'categories'})
export class Category{

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  categoryName: string

  // @ManyToMany(() => Product)
  // products: Product[]

}