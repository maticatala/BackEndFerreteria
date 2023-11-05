import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { User } from 'src/auth/entities/user.entity';
import { Direction } from 'src/directions/entities/direction.entity';
import { Pedido } from './entities/pedido.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pedido) private pedidoRepository: Repository<Pedido>,
    @InjectRepository(Product) private productoRepository: Repository<Product>,
    @InjectRepository(Direction) private directionRepository: Repository<Direction>,
  ){}
  
  async create(CreatePedidoDto: CreatePedidoDto, file: any) {
    const filePath = join('./uploads', file.filename);
    try {
      const {nroPedido,fechaPedido, fechaEntrega, products} = CreatePedidoDto;
      
      const createedProdcutos = await this.productoRepository.find({where: { id: In(products)}})

      if (createedProdcutos.length !== products.length) throw new Error('No se encontraron todos los productos');
      
      const text = {
        nroPedido,
        fechaPedido,
        fechaEntrega,
        createedProdcutos
      }

      const newPedido = this.pedidoRepository.create(text)

      console.log(newPedido);

      await this.pedidoRepository.save(newPedido)
      return newPedido
    
    } catch (error) {
      if (!error.errno) throw new BadRequestException(`${error.message}`);
      
      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  findAll() {    // return `This action returns all pedidos`;
    return this.pedidoRepository.find({
      relations: ['products']
    })


  }

  async findOne(nroPedido: number) {    // return `This action returns a #${id} pedido`;

    const pedidoFound = await this.pedidoRepository.findOne({
      where: {
        nroPedido,
      },
      relations: ['products']
    });
  
    if (!pedidoFound) throw new BadRequestException(`Pedido id ${nroPedido} does not exists`)
  
    return pedidoFound;
  }

  async update(nroPedido: number, product: UpdatePedidoDto) { 
    try{
      const {  nroPedido, fechaPedido, fechaEntrega, pedidosId} = product
      console.log(pedidosId);
      const pedidoFound = await this.pedidoRepository.findOne({
        where: {
          nroPedido,
        },
      });
  
      if (!pedidoFound) throw new HttpException(`Pedido id ${nroPedido} not found`, HttpStatus.NOT_FOUND)
  
      if(nroPedido) pedidoFound.nroPedido = nroPedido;
  
      if(fechaPedido) pedidoFound.fechaPedido = fechaPedido;

      if(fechaEntrega) pedidoFound.fechaEntrega = fechaEntrega;
  
      if (pedidosId) {
        
        const updateProducto = await this.productoRepository.find({where: { id: In(pedidosId)}});
        
        if (pedidosId.length !== updateProducto.length){ 
          throw new HttpException('No se encontraron todos los productos', HttpStatus.NOT_FOUND)
         }
  
        pedidoFound.products = updateProducto; //asigna nuevas categorias al producto 
      }
  
      return this.pedidoRepository.save(pedidoFound);
      
    } catch (error) {
      if (!error.errno) throw new BadRequestException(error.message);
      // throw new InternalServerErrorException('Something terrible happen!');
    }
  }// fin async update

  async delete(nroPedido: number) {    // return `This action removes a #${id} product`;
    
    const pedidoFound = await this.pedidoRepository.findOne({
      where: {
        nroPedido,
      },
      relations: ['products']
    });
    
    if (!pedidoFound) throw new HttpException('Product not found',HttpStatus.NOT_FOUND)

    return this.pedidoRepository.delete({ nroPedido });

  }
}