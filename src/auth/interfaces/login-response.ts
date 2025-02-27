import { UserEntity } from './../../users/entities/user.entity';


export interface LoginResponse {
  
  user: UserEntity;
  
  token: string;

}