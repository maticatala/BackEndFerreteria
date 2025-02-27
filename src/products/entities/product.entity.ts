
import { Category } from "src/categories/entities/category.entity";
import { OrdersProducts } from "src/orders/entities/orders-product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { User } from '../../auth/entities/user.entity';


@Entity({name: 'products'})
export class ProductEntity {
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

  @ManyToOne((type) => UserEntity, user => user.products)
  addedBy: UserEntity;

  @ManyToMany((type) => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  //Un producto puede estar en muchas lineas de pedido
  @OneToMany((type) => OrdersProducts, (ordersProducts) => ordersProducts.product)
  orders: OrdersProducts[];
}
