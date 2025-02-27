import {
    BadRequestException,
    Injectable,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { Repository } from 'typeorm';
  import { InjectRepository } from '@nestjs/typeorm';
  import { UserEntity } from './entities/user.entity';

  import { RemoveUserDto } from './dto/remove-user.dto';
import { ValidatorService } from 'src/auth/validator.service';
import { CreateUserDto } from 'src/auth/dto';
  
  @Injectable()
  export class UsersService {
    constructor(
      @InjectRepository(UserEntity)
      private userRepository: Repository<UserEntity>,
      private validatorService: ValidatorService,
    ) {}
  
    async updateUser(
      userId: string,
      updateUserDto: UpdateUserDto,
    ): Promise<void> {
      const user = await this.validatorService.validateUserExistsById(Number(userId));
  
      if (
        user.firstName === updateUserDto.firstName &&
        user.lastName === updateUserDto.lastName
      )
        throw new UnprocessableEntityException('User already updated');
  
      Object.assign(user, updateUserDto);
  
      await this.userRepository.save(user);
    }
  
    async deactivateUser(userId: string): Promise<void> {
      const user = await this.validatorService.validateUserExistsById(Number(userId));
  
      if (!user.active) throw new BadRequestException('User already deactivated');
  
      user.active = false;
  
      await this.userRepository.save(user);
    }
  
    async activateUser(userId: string): Promise<void> {
      const user = await this.validatorService.validateUserExistsById(Number(userId));
  
      if (user.active) throw new BadRequestException('User already actived');
  
      user.active = true;
  
      await this.userRepository.save(user);
    }
  
    async remove(
      userId: string,
      removeUserDto: RemoveUserDto,
      currentUser: UserEntity,
    ): Promise<void> {
      await this.validatorService.validateUserExistsById(Number(userId));
  
      const { password } = removeUserDto;
  
      await this.validatorService.validateUserPassword(
        password,
        currentUser.password,
      );
  
      await this.userRepository.delete(userId);
    }
  
    async findAll() {
      const users = await this.userRepository.find({
        relations: ['role'],
      });
  
      return users.map(({ password, activationToken, resetPasswordToken, ...user }) => user);
    }
  
    async findOne(id: number) {
      const user = await this.validatorService.validateUserExistsById(id);
      const {password, activationToken, resetPasswordToken, ...rest} = user;
      return rest;
    }
  
    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
      try {
        const user = this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(user);
        console.log('Usuario creado:', savedUser); // Verifica en consola
        return savedUser;
      } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
      }
    }
    
    
  }
  