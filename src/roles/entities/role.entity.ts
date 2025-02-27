// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     OneToMany,
//   } from 'typeorm';
// import { Permission } from '../interfaces/permission.interface';
// import { UserEntity } from 'src/users/entities/user.entity';

  
//   @Entity('roles') // Nombre de la tabla
//   export class RoleEntity {
//     @PrimaryGeneratedColumn()
//     id: number;
  
//     @Column({ unique: true })
//     name: string;
  
//     @Column('simple-json')
//     permissions: Permission[];

//     // @OneToMany(() => UserEntity, (user) => user.role)
//     // users: UserEntity[];
//   }
  