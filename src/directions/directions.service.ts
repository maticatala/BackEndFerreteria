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

  async create(crearDirection: CreateDirectionDto, file: any) {
    const filePath = join('./uploads', file.filename);
    try {
      const {codigoPostal,provincia, localidad, calle,numero,pisoDepto} = crearDirection;
      
      const text = {
        
        codigoPostal,
        provincia,
        localidad,
        calle,
        numero,
        pisoDepto

      }

      const newDirection = this.directionRepository.create(text)

      console.log(newDirection);

      await this.directionRepository.save(newDirection)
      return newDirection
    
    } catch (error) {
      if (!error.errno) throw new BadRequestException(`${error.message}`);
      
      throw new InternalServerErrorException('Ocurrio un Error!');
    }
  }

  findAll() {
    return this.directionRepository.find({
      relations: ['directions']
  })

  }

  async findOne(idDire: number) {    // return `This action returns a #${id} product`;

    const directionFound = await this.directionRepository.findOne({
      where: {
        idDire,
      },
      relations: ['products']
    });
  
    if (!directionFound) throw new BadRequestException(`Direction id ${idDire} does not exists`)
  
    return directionFound;
  }

  async update(idDire: number, product: UpdateDirectionDto) { 
    try{
      const {codigoPostal,provincia, localidad, calle,numero,pisoDepto,pedidosIds} = product
      console.log(pedidosIds);
      const directionFound = await this.directionRepository.findOne({
        where: {
          idDire,
        },
      });
  
      if (!directionFound) throw new HttpException(`Direction id ${idDire} not found`, HttpStatus.NOT_FOUND)
  
      if(localidad) directionFound.localidad = localidad;

      if(calle) directionFound.calle = calle;

      if(pisoDepto) directionFound.pisoDepto = pisoDepto;

      if(numero) directionFound.numero = numero;

      if(localidad) directionFound.localidad = localidad;
  
      if(codigoPostal) directionFound.codigoPostal = codigoPostal;
  
      if (pedidosIds) {
        
        const updatePedidos = await this.pedidoRepository.find({where: { nroPedido: In(pedidosIds)}});
        
        if (pedidosIds.length !== updatePedidos.length){ 
          throw new HttpException('No se encontraron todos los pedidos', HttpStatus.NOT_FOUND)
         }
  
         directionFound.pedidos = updatePedidos; //asigna nuevas categorias al producto 
      }
  
      return this.directionRepository.save(directionFound);
      
    } catch (error) {
      if (!error.errno) throw new BadRequestException(error.message);
      // throw new InternalServerErrorException('Something terrible happen!');
    }
  }// fin async update

  async delete(idDire: number) {    // return `This action removes a #${id} product`;
    
    const directionFound = await this.directionRepository.findOne({
      where: {
        idDire,
      },
      relations: ['directions']
    });
    
    if (!directionFound) throw new HttpException('Product not found',HttpStatus.NOT_FOUND)

    return this.directionRepository.delete({ idDire });

  }
}
