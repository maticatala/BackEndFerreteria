import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/products/entities/product.entity";

//Una relación muchos a muchos con atributos se transforma en una nueva entidad 
//! Cambiar nombre a orders_lines
@Entity({ name: "orders_products" })
export class OrdersProducts {
  @PrimaryGeneratedColumn()
  id: number;

  //Precio unitario
  @Column({type: "decimal", precision: 10, scale: 2, default: 0.0})
  product_unit_price: number;

  //Cantidad del producto
  @Column()
  product_quantity: number;

  //Un pedido puede debe tener una o muchas lineas de pedido, una linea de pedido pertenece a un unico pedido
  @ManyToOne((type) => Order, order => order.products)
  order: Order;
    
  //Un producto puede estar en muchas lineas de pedido, una linea de pedido tiene un unico producto
  //? ¿Hace falta el cascade true si tenemos una baja logica de los productos?
  @ManyToOne((type) => Product, product => product.orders, {cascade: true})
  product: Product;
}