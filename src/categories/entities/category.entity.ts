import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from "src/products/entities/product.entity";
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

  @ManyToOne((type) => UserEntity, user => user.categories)
  addedBy: UserEntity;

  @ManyToMany((type) => ProductEntity, (product) => product.categories)
  products: ProductEntity[];

}