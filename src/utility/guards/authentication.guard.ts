import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      throw new UnauthorizedException('Token inválido');
    }
    return true;
  }
}