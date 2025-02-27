import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from './entities/user.entity';
// import { Auth } from 'src/utility/decorators/auth.decorator';
// import { Resource } from 'src/roles/enums/resource.enum';
// import { Action } from 'src/roles/enums/action.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(Number(id));
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  async update(@Param('id') id: string,@Body() updateUserDto: UpdateUserDto): Promise<void> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('deactivate/:id')
  async deactivate(@Param('id') id: string): Promise<void> {
    return await this.usersService.deactivateUser(id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('activate/:id')
  async activate(@Param('id') id: string): Promise<void> {
    return await this.usersService.activateUser(id);
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Body() removeUserDto: RemoveUserDto, @CurrentUser() currentUser: UserEntity ): Promise<void> {
    return await this.usersService.remove(id, removeUserDto, currentUser);
  }

}
