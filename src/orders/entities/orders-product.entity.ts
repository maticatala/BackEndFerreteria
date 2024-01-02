import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/products/entities/product.entity";

@Entity({ name: "orders_products" })
export class OrdersProducts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "decimal", precision: 10, scale: 2, default: 0.0})
  product_unit_price: number;

  @Column()
  product_quantity: number;

  @ManyToOne((type) => Order, order => order.products)
  order: Order;
    
  @ManyToOne((type) => Product, product => product.orders, {cascade: true})
  product: Product;
}