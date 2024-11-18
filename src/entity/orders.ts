import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users';
import { OrdersItems } from './ordersItems';

@Entity({ name: 'Orders' })
export class Orders {
  @PrimaryGeneratedColumn({ name: 'orderId' })
  OrderID: number;

  @ManyToOne(() => Users, (user) => user.orders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  User: Users;

  @OneToMany(() => OrdersItems, (orderItem) => orderItem.Orders, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  OrderItems: OrdersItems[]; // Quan hệ OneToMany tới bảng OrdersItems

  @Column({
    type: 'enum',
    enum: ['InProgress', 'Resolved', 'Closed'],
    default: 'InProgress',
    nullable: false,
    name: 'status',
  })
  Status: string;

  @CreateDateColumn({ name: 'createdAt', nullable: false })
  CreatedAt: Date;
  @CreateDateColumn({ name: 'updatedAt', nullable: false })
  UpdatedAt: Date;
}
