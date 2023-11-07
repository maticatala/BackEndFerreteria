import { User } from "src/auth/entities/user.entity";
import { Direction } from "src/directions/entities/direction.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'pedidos'})
export class Pedido {

    @PrimaryGeneratedColumn()
    nroPedido:number;

    @Column({type: 'datetime', default:() => 'CURRENT_TIMESTAMP'})
    fechaPedido: Date;

    @Column({ type: 'datetime', nullable: true })
    fechaEntrega: Date;


    @ManyToOne(() => Direction, (directions) => directions.pedidos)
    direction: Direction;

    @ManyToOne(()=> User, (users) => users.pedidos)
    user:User;

    @ManyToMany(() => Product, (product) => product.pedidos)
    @JoinTable({
        name: 'detalle_pedido',
        joinColumn: {
            name:'pedido_id'
        },
        inverseJoinColumn: {
            name: 'product_id'
        }
    })
    products: Product[];
}