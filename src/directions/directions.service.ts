import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { extname, join } from 'path';
import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Pedido } from 'src/pedidos/entities/pedido.entity';
import { User } from 'src/auth/entities/user.entity';
import { Direction } from './entities/direction.entity';
import { Status } from './interfaces/status.enum';

@Injectable()
export class DirectionsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pedido) private pedidoRepository: Repository<Pedido>,
    @InjectRepository(Direction)
    private directionRepository: Repository<Direction>,
  ) {}


  async createDirection(createDirectionDto: CreateDirectionDto) {
    try {
      
      const {userId} = createDirectionDto

      const user = await this.searchUser(userId)

      const newDirection = this.directionRepository.create(createDirectionDto);
      newDirection.user = user;

      return this.directionRepository.save(newDirection);
    } catch (error) {
      if (!error.errno) throw new BadRequestException(`${error.message}`);

      throw new InternalServerErrorException('Ocurrio un Error!');
    }
  }

  async findAll() {
    return await this.directionRepository.find({
      where: {
        isActive: Status.active
      },
      relations: ['user'],
    });
    
  }

  async findOne(id: number) {
    // return `This action returns a #${id} direction`;
    return await this.searchDirection(id);
  }

  async findAllByUserId(userId: number) {
    const userFound = await this.searchUser(userId);

    return await this.directionRepository.find({
      where: {
        user: userFound,
      },
      relations: ['user'],
    });
  }

  async update(id: number, updateDirectionDto: UpdateDirectionDto) {
    try {
      const { userId, pedidosIds } = updateDirectionDto;

      const directionFound = await this.searchDirection(id);

      if (pedidosIds) {
        directionFound.pedidos = await this.searchPedidos(pedidosIds);
      }
      
      if (userId) {
        directionFound.user = await this.searchUser(userId);
      }

      this.directionRepository.merge(directionFound, updateDirectionDto);

      return await this.directionRepository.save(directionFound);
    } catch (error) {
      if (!error.errno) throw new BadRequestException(error.message);

      throw new InternalServerErrorException('Something terrible happen!');
    }
  } 

  // async delete(id: number) {
  //   // return `This action removes a #${id} product`;
  //   await this.searchDirection(id);
    
  //   return await this.directionRepository.delete(id);
  // }


  async logicRemove(id: number) {
      const directionFound = await this.searchDirection(id);
  
      directionFound.isActive = Status.inactive;

      return await this.directionRepository.save(directionFound);
  }

  //PRIVATE METHODS
  private async searchDirection(directionId: number): Promise<Direction> {
    const directionFound = await this.directionRepository.findOne({
      where: { 
        id: directionId,
        isActive: Status.active
       },
      relations: ['user'],
    });

    if (!directionFound) {
      throw new NotFoundException(`Direction ${directionId} does not exists!`);
    }

    return directionFound;
  }

  private async searchUser(userId: number): Promise<User> {
    const userFound = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userFound) throw new Error(`User ${userId} does not exists!`);

    return userFound;
  }

  private async searchPedidos(nroPedidos: Pedido[]): Promise<Pedido[]> {
    const createdProducts = await this.pedidoRepository.find({
      where: { nroPedido: In(nroPedidos) },
    });

    if (createdProducts.length !== nroPedidos.length)
      throw new NotFoundException('Not all orders found');

    return createdProducts;
  }
}
