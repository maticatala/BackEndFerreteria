import { Body, Controller, Get, Param, Post, UseGuards, Request, Query, Patch, Delete } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, CreateUserDto, PaginationQueryDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces';
import { PaginationResponseDto } from '../shared/interfaces/pagination-response.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) { }
  
  @UseGuards( AuthGuard )
  @Get()
  findAll(): Promise<User[]> {
    return this.authService.findAll();
  }

  /*
    * El controlador se encarga de escuchar las peticiones GET, POST, PUT, PATCH
  */ 
  @UseGuards( AuthGuard )
  @Get('/check-token')
  checkToken(@Request() req: Request): LoginResponse {
    const user = req['user'];

    return {
      user,
      token: this.authService.getJwtToken({id: user.id})
    };
  }

  @Get(':email')
  findByUserEmail(@Param('email') email: string): Promise<Boolean> {
    return this.authService.findUserByEmail(email);
  }

  @Get(':id')
  findByUserId(@Param('id') id: number): Promise<User> {
    return this.authService.findUserById(id);
  }

  @UseGuards( AuthGuard )
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.authService.createUser(newUser);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @UseGuards( AuthGuard )
  @Delete(':id')
  register(@Param('id') id: number) {
    return this.authService.delete(+id);
  }
  
}