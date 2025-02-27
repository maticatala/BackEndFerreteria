import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Action } from './enums/action.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  private resourceActions = {
    auth: [
      Action.read,
      Action.create,
      Action.update,
      Action.delete,
      // Action.activate,
    ],
    product: [
      Action.read,
      Action.create,
      Action.update,
      Action.delete,
      // Action.list,
    ],
    // Otros recursos
  };

  getActionsForResource(resource: string) {
    // Devolver solo las acciones que aplican al recurso
    return this.resourceActions[resource] || [];
  }

  getResourcesWithActions() {
    // Devolver solo las acciones que aplican al recurso
    return this.resourceActions;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const newRole = await this.roleRepository.create(createRoleDto);

    return await this.roleRepository.save(newRole);
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOneBy({id});

    if (!role) {
      throw new NotFoundException({
        code: 'ROLE_NOT_FOUND',
        message: 'Rol no encontrado',
      });
    }

    return role
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const roleExist = await this.roleRepository.findOneBy({id});

    if (!roleExist) throw new NotFoundException();

    try {
      this.roleRepository.merge(roleExist, updateRoleDto);

      return await this.roleRepository.save(roleExist);
    } catch (error) {
      if (error.code = "ER_DUP_ENTRY") {
        throw new ConflictException({
          code: 'NAME_ALREADY_REGISTERED',
          message: 'El nombre de rol ya está usado',
        });
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(roleId: number) {
    const role = await this.roleRepository.findOne({where: {id: roleId}, relations: ['users']})

    if(!role) throw new NotFoundException({
      code: 'ROLE_NOT_FOUND',
      message: 'Rol no encontrado',
    });

    if (role.users.length !== 0) throw new UnprocessableEntityException({
      code: 'ROLE_HAS_USERS',
      message: 'No se puede eliminar el rol, está asignado a un usuario',
    })

    try {
      await this.roleRepository.delete(roleId);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
