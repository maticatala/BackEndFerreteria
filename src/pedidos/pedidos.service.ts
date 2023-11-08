import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(Direction)
    private directionRepository: Repository<Direction>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    try {
      const { userId, directionId, productsIds, fechaPedido, fechaEntrega } =
        createPedidoDto;

      // Search for required resources concurrently
      const [createdProducts, directionFound, userFound] = await Promise.all([
        this.searchProducts(productsIds),
        this.searchDirection(directionId),
        this.searchUser(userId),
      ]);

      // Create and save the new Pedido
      const newPedido = this.pedidoRepository.create({
        products: createdProducts,
        direction: directionFound,
        user: userFound,
        fechaEntrega,
        fechaPedido,
      });

      return await this.pedidoRepository.save(newPedido);
    } catch (error) {
      if (!error.errno) throw new BadRequestException(`${error.message}`);

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async findAll() {
    // return `This action returns all pedidos`;

    return await this.pedidoRepository.find({
      relations: ['user', 'direction'],
    });
  }

  async findOne(nroPedido: number) {
    // return `This action returns a #${id} pedido`;
    return await this.searchPedido(nroPedido);
  }

  async update(nroPedido: number, updatePedidoDto: UpdatePedidoDto) {
    try {
      const { userId, directionId, productsIds } = updatePedidoDto;

      const pedidoFound = await this.searchPedido(nroPedido);

      if (userId) {
        pedidoFound.user = await this.searchUser(userId);
      }

      if (directionId) {
        pedidoFound.direction = await this.searchDirection(directionId);
      }

      if (productsIds) {
        pedidoFound.products = await this.searchProducts(productsIds);
      }

      this.pedidoRepository.merge(pedidoFound, updatePedidoDto);

      return this.pedidoRepository.save(pedidoFound);
    } catch (error) {
      if (!error.errno) throw new BadRequestException(error.message);

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async delete(nroPedido: number) {
    // return `This action removes a #${id} product`;

    await this.searchPedido(nroPedido);

    return this.pedidoRepository.delete({ nroPedido });
  }

  //PRIVATE METHODS
  private async searchPedido(nroPedido: number): Promise<Pedido> {
    const pedidoFound = await this.pedidoRepository.findOne({
      where: { nroPedido },
      relations: ['user', 'direction', 'products'],
    });

    if (!pedidoFound)
      throw new NotFoundException(`Pedido ${nroPedido} does not exists!`);

    return pedidoFound;
  }

  private async searchProducts(productsIds: number[]): Promise<Product[]> {
    const createdProducts = await this.productoRepository.find({
      where: { id: In(productsIds) },
    });

    if (createdProducts.length !== productsIds.length)
      throw new NotFoundException('Not all products found');

    return createdProducts;
  }

  private async searchDirection(directionId: number): Promise<Direction> {
    const directionFound = await this.directionRepository.findOne({
      where: { id: directionId },
    });

    if (!directionFound)
      throw new NotFoundException(`Direction ${directionId} does not exists!`);

    return directionFound;
  }

  private async searchUser(userId: number): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userFound) throw new Error(`User ${userId} does not exists!`);

    return userFound;
  }
}