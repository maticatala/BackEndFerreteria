
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs'

import { User } from './entities/user.entity';
import { JwtPayload, LoginResponse } from './interfaces';;
import { LoginDto, CreateUserDto, RegisterDto, UpdateUserDto } from './dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { IMailService } from 'src/mails/interfaces/mails.interface';
import { v4 } from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  
  private keepLogged: boolean = false;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    
        @Inject('IMailService')
        private mailsService: IMailService,
    
    private jwtService: JwtService,
  ) { }
  
  //Mecanismo para crear un usuario
  async createUser(createUserDto: CreateUserDto | RegisterDto): Promise<User> {
    try {
      //ENCRIPTAR CONTRASEÑA
      createUserDto.password = await bcryptjs.hashSync(createUserDto.password, 10);
      
      let user = await this.userRepository.create(createUserDto);

      user = await this.userRepository.save(user);

      delete user.password;

      return user;
      
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException(`${createUserDto.email} alredy exists!`);
      }

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async register(registerDto: RegisterDto): Promise<LoginResponse> {

    const user = await this.createUser(registerDto);

    return {
      user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password, keepLogged } = loginDto;

    if (keepLogged) this.keepLogged = true;

    const user = await this.userRepository.createQueryBuilder('users').addSelect('users.password').where('users.email=:email',{email:email}).getOne();

    if (!user) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    delete user.password;
    
    return {
      user,
      token: this.getJwtToken({id: user.id})
    };
  }

  async findAll() {
    return await this.userRepository.find();
  }
  
  async findUserById(id: number): Promise<User> {
    
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`user id ${id} does not exist`);
    
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } }); 
    
    if (user)
      throw new BadRequestException(`the email ${email} is aleady in use`);

    return user;
  }

  async update(id:number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException(`user ${id} does not exists!`);

      const { password } = updateUserDto

      if (password) updateUserDto.password = await bcryptjs.hashSync(password, 10);

      let editedUser = this.userRepository.merge(user, updateUserDto);
      editedUser = await this.userRepository.save(editedUser);

      delete editedUser.password;

      return editedUser;
    } catch (error) {
      if (error.errno === 1062) {
        throw new BadRequestException(`the email ${updateUserDto.email} is aleady in use`);
      }

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async updateUserById(updateUserDto: UpdateUserDto, currentUser: User){
    try {
      let editedUser = this.userRepository.merge(currentUser, updateUserDto);

      editedUser = await this.userRepository.save(editedUser);

      delete editedUser.password;

      return editedUser;
    } catch (error) {

      throw new InternalServerErrorException('Something terrible happen!');
    }
  }

  async delete(id: number) {
    return await this.userRepository.delete(id);
  }
  
  getJwtToken( payload: JwtPayload) {

    if (this.keepLogged) {
      return this.jwtService.sign(payload); // Token sin tiempo de expiración
    } else {
      return this.jwtService.sign(payload, { expiresIn: '1hr' });
    }

  }

  //reset password
  async requestResetPassword(
    requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<void> {
    const { email } = requestResetPasswordDto;

    const user = await this.validateUserExistsByEmail(email);

    await this.assignResetPasswordToken(user);

    await this.sendRequestPasswordEmail(user);
  }

  async validateUserExistsByEmail(email: string): Promise<User> {
    const userExists = await this.userRepository.findOne({where:{email}});

    if (!userExists) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado',
      });
    }

    return userExists;
  }

  private async assignResetPasswordToken(user: User): Promise<void> {
    const token = v4();

    user.resetPasswordToken = token;

    await this.userRepository.save(user);
  }

  private async sendRequestPasswordEmail(user: User): Promise<void> {
    await this.mailsService.restorePassword(
      user.firstName,
      user.email,
      user.resetPasswordToken,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { resetPasswordToken, password } = resetPasswordDto;

    const user =
      await this.validateUserResetPasswordToken(
        resetPasswordToken,
      );

    user.resetPasswordToken = null;

    user.password = await bcryptjs.hashSync(password, 10);

    await this.userRepository.save(user);
  }

  async validateUserResetPasswordToken(resetPasswordToken: string) {
    const userExists = await this.userRepository.findOneBy({
      resetPasswordToken,
    });

    if (!userExists) {
      throw new UnprocessableEntityException(
        'Está accion no puede ser completada.',
      );
    }

    return userExists;
  }

}