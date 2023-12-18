
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs'

import { User } from './entities/user.entity';
import { JwtPayload, LoginResponse, Roles } from './interfaces';;
import { LoginDto, CreateUserDto, RegisterDto, UpdateUserDto } from './dto';




@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    
    private jwtService: JwtService,
  ) { }
  
  //Mecanismo para crear un usuario
  async createUser(createUserDto: CreateUserDto): Promise<User> {
  
    try {
      const { password, ...userData } = createUserDto;

      //ENCRIPTAR CONTRASEÑA
      const newUser = this.userRepository.create({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

      await this.userRepository.save(newUser);

      const { password: _, ...user } = newUser;

      return user;
      
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException(`${createUserDto.email} alredy exists!`);
      }
      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    
    const newUser: CreateUserDto = registerDto;
    newUser.rol = Roles.user;

    const user = await this.createUser(newUser);

    return {
      user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { password: _, ...rest } = user;
    
    return {
      user: rest,
      token: this.getJwtToken({id: user.id})
    };
  }

  async findAll() {
    const results = await this.userRepository.find();
    const userWithoutPassword = results.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword;
    })

    return userWithoutPassword;
  }
  
  async findUserById(id: number): Promise<User> {
    
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException(`user id ${id} does not exist`);
    const { password, ...rest } = user;
    return rest; 
    
  }

  async findUserByEmail(email: string): Promise<Boolean> {
    
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) return true;

    return false; 
    
  }

  async update(id:number, updateUserDto: UpdateUserDto): Promise<User> {
    
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new BadRequestException(`user ${id} does not exists!`);

    const editedUser = this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(editedUser);

  }

  async delete(id: number) {
    return await this.userRepository.delete(id);
  }

  
  getJwtToken( payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}