import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
// import { RoleEntity } from 'src/roles/entities/role.entity';
// import { RoleEntity } from 'src/roles/entities/role.entity';

@Injectable()
export class ValidatorService {
  constructor(
    @InjectRepository(UserEntity)
    private authRepository: Repository<UserEntity>,
  ) {}

  async validateUserExistsById(userId: number): Promise<UserEntity> {
    const userExists = await this.authRepository.findOne({ where: {id: userId, active: true}, relations: ['role'] });
    if (!userExists) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      });
    }
    return userExists;
  }

  async validateUserExistsByEmail(email: string): Promise<UserEntity> {
    const userExists = await this.authRepository.findOne({where:{email}});

    if (!userExists) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      });
    }

    return userExists;
  }

  async validateUserPassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const result = await bcryptjs.compare(password, userPassword);

    if (!result)
      throw new UnauthorizedException('Please check your credentials.');
    return result;
  }

  async validateUserActivationToken(
    activationToken: string,
  ): Promise<UserEntity> {
    const userExists = await this.authRepository.findOneBy({
      activationToken,
      active: false,
    });
    if (!userExists) {
      throw new UnauthorizedException(
        'Está accion no puede ser completada.',
      );
    }
    return userExists;
  }

  async validateUserResetPasswordToken(resetPasswordToken: string) {
    const userExists = await this.authRepository.findOneBy({
      resetPasswordToken,
      active: true,
    });

    if (!userExists) {
      throw new UnprocessableEntityException(
        'Está accion no puede ser completada.',
      );
    }

    return userExists;
  }

  validateUserIsNotActive(user: UserEntity): void {
    if (user.active) {
      throw new BadRequestException({
        code: 'USER_ACTIVE',
        message: 'El usuario ya está activado.',
      });
    }
  }

    // async validateUserRole(role: RoleEntity) {
    //   return await this.authRepository.findOne({ where: {id: role.id}, relations: ['role'] }); 
    // }
}
