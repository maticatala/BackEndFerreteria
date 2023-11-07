import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { extname, join } from 'path';
import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Pedido } from 'src/pedidos/entities/pedido.entity';
import { User } from 'src/auth/entities/user.entity';
import { Direction } from './entities/direction.entity';

@Injectable()
export class DirectionsService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pedido) private pedidoRepository: Repository<Pedido>,
    @InjectRepository(Direction) private directionRepository: Repository<Direction>
  ) {}

  async createDirection(id: number, crearDirection: CreateDirectionDto) {

    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new Error(`User ${id} does not exists!`);

      const newDirection = this.directionRepository.create(crearDirection);
      newDirection.user = user;
      
      return this.directionRepository.save(newDirection);
    
    } catch (error) {
      if (!error.errno) throw new BadRequestException(`${error.message}`);
      
      throw new InternalServerErrorException('Ocurrio un Error!');
    }
  }

  async findAll() {
    return await this.directionRepository.find({
      relations: ['user']
    })

  }

  async findOne(id: number) {    // return `This action returns a #${id} direction`;

    const directionFound = await this.directionRepository.findOne({
      where: {
        id,
      },
      relations: ['user']
    });
  
    if (!directionFound) throw new BadRequestException(`Direction id ${id} does not exists`);

  
    return directionFound;
  }

  async findAllByUserId(userId: number) {
    const userFound = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!userFound) throw new BadRequestException(`Use ${userId} does not exists!`);

    return await this.directionRepository.find({
      where: {
        user: userFound
      },
      relations: ['user']
    })
  }

  async update(id: number, updateDirectionDto: UpdateDirectionDto) { 
    try {
      
      const { userId, pedidosIds } = updateDirectionDto;
      
      const directionFound = await this.directionRepository.findOne({
        where: {
          id,
        },
      });
  
      if (!directionFound) throw new HttpException(`Direction id ${id} not found`, HttpStatus.NOT_FOUND)
  
      if (pedidosIds) {
        
        const updatePedidos = await this.pedidoRepository.find({where: { nroPedido: In(pedidosIds)}});
        
        if (pedidosIds.length !== updatePedidos.length){ 
          throw new HttpException('No se encontraron todos los pedidos', HttpStatus.NOT_FOUND)
         }
      }

      if (userId) {
        const updateUser = await this.userRepository.findOne({where: {id:userId}});

        if (!updateUser) throw new BadRequestException(`Use ${userId} does not exists!`);
      }

      this.directionRepository.merge(directionFound, updateDirectionDto);
      
  
      return await this.directionRepository.save(directionFound);
      
    } catch (error) {
      if (!error.errno) throw new BadRequestException(error.message);
      // throw new InternalServerErrorException('Something terrible happen!');
    }
  }// fin async update

  async delete(id: number) {    // return `This action removes a #${id} product`;
    
    const directionFound = await this.directionRepository.findOne({
      where: {
        id,
      }
    });
    
    if (!directionFound) throw new BadRequestException(`Direction ${id} does not exists!`);

    return await this.directionRepository.delete(id);

  }
}
