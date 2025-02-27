import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Resource } from './enums/resource.enum';
import { Action } from './enums/action.enum';
import { CreateRoleDto } from './dto/role.dto';
import { Auth } from 'src/utility/decorators/auth.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';



@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('resources')
  getResources() {
    return this.rolesService.getResourcesWithActions();
  }

  // @Auth([{resource: Resource.users, actions: [Action.read, Action.create, Action.update]}])
  @Get('/:id')
  async getRoleById(@Param('id') id:string) {
    return await this.rolesService.findOne(+id);
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto);
  }

  @Patch(':id')
  async updateRole(@Param('id') id: string,@Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.remove(+id);
  }
}
