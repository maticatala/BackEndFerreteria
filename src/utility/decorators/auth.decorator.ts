    import { applyDecorators, UseGuards } from '@nestjs/common';
    import { AuthenticationGuard } from '../guards/authentication.guard';
    import { AuthorizeGuard } from '../guards/authorization.guard';
    import { Permissions } from 'src/utility/decorators/permissions.decorator';
    import { Permission } from 'src/roles/interfaces/permission.interface';

    export function Auth(permissions: Permission[]) {
      return applyDecorators(
        Permissions(permissions),
        UseGuards(AuthenticationGuard, AuthorizeGuard),
      );
    }
