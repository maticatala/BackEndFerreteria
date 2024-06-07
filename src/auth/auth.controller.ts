import { Body, Controller, Get, Param, Post, UseGuards, Request, Query, Patch, Delete, BadRequestException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { LoginResponse, Roles } from './interfaces';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';


@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) { }
  
  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get()
  findAll(): Promise<User[]> {
    return this.authService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get('/check-token')
  checkToken(@CurrentUser() currentUser: User): LoginResponse {
    return {
      user: currentUser,
      token: this.authService.getJwtToken({id: currentUser.id})
    };
  }

  //Devuelve true si esta disponible
  @Get(':email')
  async findByUserEmail(@Param('email') email: string): Promise<Boolean> {
    const user = await this.authService.findUserByEmail(email)
    return !user;
  }

  @Get('/id/:id')
  findByUserId(@Param('id') id: string): Promise<User> {
    return this.authService.findUserById(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('/updateUser')
  updateUserById(@Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: User) {
    return this.authService.updateUserById(updateUserDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.authService.createUser(newUser);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() newUser: RegisterDto) {
    return this.authService.register(newUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.authService.delete(+id);
  }
  
}