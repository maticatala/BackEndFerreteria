import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload';
import { verify } from 'jsonwebtoken';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
  ){}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      req['user'] = null;
      next();
      return;
    } 

    //Esté middleware se ejecuta antes de cada peticion http y nos permite verificar el token del usuario
    //Validamos el token
    try {
      const { id } = <JwtPayload>verify(token, process.env.JWT_SEED);
      const user = await this.authService.findUserById(+id);

      //Asigna una propiedad "user" a la request y le guarda el usuario
      req['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    //Si viene la palabra Bearer devuelve el token, sino devuelve undefined
    //El token viaja a través de los headers en un apartado especial llamado Authorization y es un Bearer token
    return type === 'Bearer' ? token : undefined;
  }
}
