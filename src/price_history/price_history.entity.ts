import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'prices_history'})
export class PriceHistory{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    dateSince: Date;

    @Column('decimal',{precision:6, scale:2})
    price: number;

    @ManyToOne(() => Product, (product) => product.price)
    product: Product;

}