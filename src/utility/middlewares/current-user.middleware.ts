// import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { AuthService } from 'src/auth/auth.service';
// import { JwtPayload } from 'src/auth/interfaces/jwt-payload';
// import { verify } from 'jsonwebtoken';

// @Injectable()
// export class CurrentUserMiddleware implements NestMiddleware {
//   constructor(
//     private readonly authService: AuthService,
//   ){}
//   async use(req: Request, res: Response, next: NextFunction) {
//     const token = this.extractTokenFromHeader(req);

//     if (!token) {
//       req['user'] = null;
//       next();
//       return;
//     } 

//     //Esté middleware se ejecuta antes de cada peticion http y nos permite verificar el token del usuario
//     //Validamos el token
//     try {
//       const { id } = <JwtPayload>verify(token, process.env.JWT_SEED);
//       const user = await this.authService.findUserById(+id);

//       //Asigna una propiedad "user" a la request y le guarda el usuario
//       req['user'] = user;
//     } catch (error) {
//       throw new UnauthorizedException();
//     }
//     next();
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers['authorization']?.split(' ') ?? [];

//     //Si viene la palabra Bearer devuelve el token, sino devuelve undefined
//     //El token viaja a través de los headers en un apartado especial llamado Authorization y es un Bearer token
//     return type === 'Bearer' ? token : undefined;
//   }
// }

import { Injectable, NestMiddleware} from "@nestjs/common";
import { isArray } from "class-validator";
import { NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { Request, Response } from "express";
import { UserEntity } from "src/users/entities/user.entity";
import { ValidatorService } from "src/auth/validator.service";

declare global {
    namespace Express {
      interface Request {
        currentUser?: UserEntity;
      }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly validatorService:ValidatorService){}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
  
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
      req.currentUser = null;
      next();
      return;
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const { payload } = <JwtPayload>verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
      
      const currentUser = await this.validatorService.validateUserExistsById(Number(payload.id));

      req.currentUser = currentUser;
      next();
    } catch (error) {
      req.currentUser = null;
      next();
    }
  }
}

interface JwtPayload {
  payload: {
    id: string,
    email: string,
    roleId: number,
    active: boolean
  },
  iat: number,
  exp: number
}

