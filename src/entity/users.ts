import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Orders } from './orders';

@Entity({ name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn({ name: 'userId' })
  UserID: number;

  @Column({ name: 'email', nullable: false })
  Email: string;

  @Column({ name: 'password', nullable: false })
  Password: string;

  @Column({ name: 'fullname', nullable: true })
  FullName: string;

  @Column({ name: 'phoneNumber', nullable: false })
  PhoneNumber: string;

  @Column({ name: 'address', nullable: true })
  Address: string;

  @CreateDateColumn({ name: 'createdAt', nullable: false })
  CreatedAt: Date;

  @CreateDateColumn({ name: 'updatedAt', nullable: false })
  UpdatedAt: Date;

  @Column({ name: 'isAdmin', type: 'boolean', default: false, nullable: false })
  IsAdmin: boolean;

  @Column({ name: 'refreshToken', nullable: true, type: 'text' })
  RefreshToken: string;

  @OneToMany(() => Orders, (order) => order.User)
  orders: Orders[];
}
