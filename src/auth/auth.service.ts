
// import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';

// import { Repository } from 'typeorm';
// import * as bcryptjs from 'bcryptjs'
// import { sign } from 'jsonwebtoken';

// import { JwtPayload, LoginResponse, Roles } from './interfaces';;
// import { LoginDto, CreateUserDto, RegisterDto, UpdateUserDto } from './dto';
// import { UserEntity } from 'src/users/entities/user.entity';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import { ValidatorService } from './validator.service';
// import { ResetPasswordDto } from './dto/reset-password.dto';
// import { ActivateUserDto } from './dto/activate-user.dto';
// import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
// import { IMailService } from 'src/mails/interfaces/mails.interface';
// import { RolesService } from 'src/roles/roles.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(UserEntity)
//     private authRepository: Repository<UserEntity>,
//     @Inject('IMailService')
//     private mailsService: IMailService,
//     private validatorService: ValidatorService,
//     private roleService: RolesService,
//   ) {}
  
//   //Mecanismo para crear un usuario


//   async login(loginDto: LoginDto): Promise<{ accessToken: string }> {

//     const { email, password } = loginDto;
//     const user = await this.validatorService.validateUserExistsByEmail(email);

//     await this.validatorService.validateUserPassword(password, user.password);

//     const payload: JwtPayload = {
//       id: user.id.toString(),
//       email: user.email,
//       active: user.active,
//     };

//     const accessToken = await this.accessToken(payload);

//     return { accessToken };
//   }

//   async changePassword(
//     changePassword: ChangePasswordDto,
//     user: UserEntity,
//   ): Promise<void> {
//     const { oldPassword, newPassword } = changePassword;

//     await this.validatorService.validateUserPassword(
//       oldPassword,
//       user.password,
//     );

//     await this.encodePassword(newPassword, user);
//   }
//   private async encodePassword(password: string, user: UserEntity): Promise<void> {
//     user.password = await bcryptjs.hash(password, 10);
//     await this.userRepository.save(user);
//   }

//   async findAll() {
//     return await this.userRepository.find();
//   }

//   async accessToken(payload: JwtPayload): Promise<string> {
//     return sign({ payload }, process.env.ACCESS_TOKEN_SECRET_KEY, {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
//     });
//   }

//   async inviteUserToStaff(
//     inviteUser: CreateUserDto,
//   ): Promise<void> {
//     const user = await this.createUser(inviteUser);

//     await this.sendVerificationEmail(user);
//   }

//   private async sendVerificationEmail(user: UserEntity): Promise<void> {
//     console.log(`Sending verification email to ${user.email}`);
//   }

//   async resendActivationEmail(email: string): Promise<void> {
//     const user = await this.validatorService.validateUserExistsByEmail(email);

//     await this.validatorService.validateUserIsNotActive(user);

//     await this.sendConfirmationEmail(user);
//   }

//   private async sendConfirmationEmail(user: UserEntity): Promise<void> {
//     console.log(`Sending confirmation email to ${user.email}`);
//   }

//   async verifyUser(activateUserDto: ActivateUserDto): Promise<void> {
//     const { activationUsertoken, password } = activateUserDto;

//     const user =
//       await this.validatorService.validateUserActivationToken(
//         activationUsertoken,
//       );

//     user.active = true;
    
//     user.activationToken = null;

//     await this.encodePassword(password, user);
//   }

//   async requestResetPassword(
//     requestResetPasswordDto: RequestResetPasswordDto,
//   ): Promise<void> {
//     const { email } = requestResetPasswordDto;

//     const user = await this.validatorService.validateUserExistsByEmail(email);

//     await this.assignResetPasswordToken(user);

//     await this.sendRequestPasswordEmail(user);
//   }

//   private async assignResetPasswordToken(user: UserEntity): Promise<void> {
//     user.resetPasswordToken = await bcryptjs.hash(user.email + Date.now(), 10);
//     await this.userRepository.save(user);
//   }

//   private async sendRequestPasswordEmail(user: UserEntity): Promise<void> {
//     console.log(`Sending request password email to ${user.email}`);
//   }

//   async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
//     const { resetPasswordToken, password } = resetPasswordDto;

//     const user =
//       await this.validatorService.validateUserResetPasswordToken(
//         resetPasswordToken,
//       );

//     user.resetPasswordToken = null;

//     await this.encodePassword(password, user);
//   }
  
//   async findUserById(id: number): Promise<UserEntity> {
    
//     const user = await this.userRepository.findOne({ where: { id } });

//     if (!user) throw new NotFoundException(`user id ${id} does not exist`);
    
//     return user;
//   }

//   async findUserByEmail(email: string): Promise<UserEntity> {
//     const user = await this.userRepository.findOne({ where: { email } }); 
    
//     if (user)
//       throw new BadRequestException(`the email ${email} is aleady in use`);

//     return user;
//   }

//   async update(id:number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
//     try {
//       const user = await this.userRepository.findOne({ where: { id } });

//       if (!user) throw new NotFoundException(`user ${id} does not exists!`);

//       const { password } = updateUserDto

//       if (password) updateUserDto.password = await bcryptjs.hashSync(password, 10);

//       let editedUser = this.userRepository.merge(user, updateUserDto);
//       editedUser = await this.userRepository.save(editedUser);

//       delete editedUser.password;

//       return editedUser;
//     } catch (error) {
//       if (error.errno === 1062) {
//         throw new BadRequestException(`the email ${updateUserDto.email} is aleady in use`);
//       }

//       throw new InternalServerErrorException('Something terrible happen!');
//     }
//   }

//   async updateUserById(updateUserDto: UpdateUserDto, currentUser: UserEntity){
//     try {
//       let editedUser = this.userRepository.merge(currentUser, updateUserDto);

//       editedUser = await this.userRepository.save(editedUser);

//       delete editedUser.password;

//       return editedUser;
//     } catch (error) {

//       throw new InternalServerErrorException('Something terrible happen!');
//     }
//   }

//   async delete(id: number) {
//     return await this.userRepository.delete(id);
//   }
  
//   getJwtToken( payload: JwtPayload) {

//     if (this.keepLogged) {
//       return this.jwtService.sign(payload); // Token sin tiempo de expiración
//     } else {
//       return this.jwtService.sign(payload, { expiresIn: '1hr' });
//     }

//   }
// }

import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { IMailService } from 'src/mails/interfaces/mails.interface';
import { v4 } from 'uuid';
import * as bcryptjs from 'bcryptjs';
import { ValidatorService } from './validator.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, sign } from 'jsonwebtoken';

import { ActivateUserDto } from './dto/activate-user.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

import { RolesService } from 'src/roles/roles.service';
import { ChangeRoleDto } from './dto/change-role.dto';
import { RegisterDto } from './dto';
import { LoginResponse } from './interfaces';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  private keepLogged: boolean;

  constructor(
    @InjectRepository(UserEntity)
    private authRepository: Repository<UserEntity>,
    @Inject('IMailService')
      private readonly mailService: IMailService,
    private validatorService: ValidatorService,
    private roleService: RolesService,
    private jwtService: JwtService,
  ) {
    this.jwtService = new JwtService();
  }

  // async inviteUserToStaff(
  //   inviteUser: CreateUserDto,
  // ): Promise<void> {
  //   const user = await this.create(inviteUser);

  //   await this.sendVerificationEmail(user);
  // }

  // private async create(createUserDto: CreateUserDto): Promise<UserEntity> {
  //   let user = this.authRepository.create(createUserDto);
  //   const {roleId} = createUserDto;
  //   try {
  //     user.role = await this.roleService.findOne(roleId);
  //     user = await this.authRepository.save(user
  // );
  //     return user;
  //   } catch (error) {
  //     if (error.code === 'ER_DUP_ENTRY') {
  //       throw new ConflictException({
  //         code: 'EMAIL_ALREADY_REGISTERED',
  //         message: 'Email ya registrado',
  //       });
  //     }
  //     throw new InternalServerErrorException();
  //   }
  // }

  async sendVerificationEmail(user: UserEntity): Promise<void> {
    await this.assignActivationToken(user);

    await this.sendConfirmationEmail(user); //realizar envio de email
  }

  private async assignActivationToken(user: UserEntity): Promise<void> {
    const token = v4();

    user.activationToken = token;

    await this.authRepository.save(user);
  }

  private async sendConfirmationEmail(user: UserEntity): Promise<void> {
    await this.mailService.sendUserConfirmation(
      user.firstName,
      user.email,
      user.activationToken,
    );
  }

  async resendActivationEmail(email: string): Promise<void> {
    const user = await this.validatorService.validateUserExistsByEmail(email);

    await this.validatorService.validateUserIsNotActive(user);

    await this.sendConfirmationEmail(user);
  }

  async verifyUser(activateUserDto: ActivateUserDto): Promise<void> {
    const { activationUsertoken, password } = activateUserDto;

    const user =
      await this.validatorService.validateUserActivationToken(
        activationUsertoken,
      );

    user.active = true;
    
    user.activationToken = null;

    await this.encodePassword(password, user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {

    const { email, password } = loginDto;
    
    const user = await this.validatorService.validateUserExistsByEmail(email);

    await this.validatorService.validateUserPassword(password, user.password);

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      roleId: user.role ? user.role.id : null,
      active: user.active,
    };

    const accessToken = await this.accessToken(payload);

    return { accessToken };
  }

  async accessToken(payload: JwtPayload): Promise<string> {
    return sign({ payload }, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
    });
  }

  async requestResetPassword(
    requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<void> {
    const { email } = requestResetPasswordDto;

    const user = await this.validatorService.validateUserExistsByEmail(email);

    await this.assignResetPasswordToken(user);

    await this.sendRequestPasswordEmail(user);
  }

  private async assignResetPasswordToken(user: UserEntity): Promise<void> {
    const token = v4();

    user.resetPasswordToken = token;

    await this.authRepository.save(user);
  }

  async register(registerDto: RegisterDto): Promise<LoginResponse> {

    const user = await this.createUser(registerDto);

    return {
      user,
      token: this.getJwtToken({ id: user.id}),
    }
  }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    let user = this.authRepository.create(createUserDto);
    // const {rol} = createUserDto;
    try {
      // user.role = await this.roleService.findOne(Number(rol));
      user = await this.authRepository.save(user);
      return user;
    } catch (error) {
    //   if (error.code === 'ER_DUP_ENTRY') {
    //     throw new ConflictException({
    //       code: 'EMAIL_ALREADY_REGISTERED',
    //       message: 'Email ya registrado',
    //     });
    //   }
    //   throw new InternalServerErrorException();
    }
  }

  private async sendRequestPasswordEmail(user: UserEntity): Promise<void> {
    await this.mailService.restorePassword(
      user.firstName,
      user.email,
      user.resetPasswordToken,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { resetPasswordToken, password } = resetPasswordDto;

    const user =
      await this.validatorService.validateUserResetPasswordToken(
        resetPasswordToken,
      );

    user.resetPasswordToken = null;

    await this.encodePassword(password, user);
  }

  async changePassword(
    changePassword: ChangePasswordDto,
    user: UserEntity,
  ): Promise<void> {
    const { oldPassword, newPassword } = changePassword;

    await this.validatorService.validateUserPassword(
      oldPassword,
      user.password,
    );

    await this.encodePassword(newPassword, user);
  }

  async encodePassword(password: string, user:UserEntity): Promise<void> {
    user.password = await bcryptjs.hashSync(password, 10);

    await this.authRepository.save(user);
  }


  async changeRole(changeRoleDto: ChangeRoleDto): Promise<void> {

    const { userId, roleId } = changeRoleDto;

    const user = await this.validatorService.validateUserExistsById(Number(userId));

    const role = await this.roleService.findOne(roleId);

    user.role = role;

    this.authRepository.save(user);
  }

  getJwtToken( payload: JwtPayload) {

    if (this.keepLogged) {
      return this.jwtService.sign(payload); // Token sin tiempo de expiración
    } else {
      return this.jwtService.sign(payload, { expiresIn: '1hr' });
    }
  }
}
