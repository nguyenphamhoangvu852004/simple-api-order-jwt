import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Orders } from './orders';
import { Products } from './products';
import { ProductSizes } from './productSizes';

@Entity({ name: 'OrdersItems' })
export class OrdersItems {
  @PrimaryGeneratedColumn({ name: 'orderItemID' })
  OrderItemID: number;

  @ManyToOne(() => Orders, (order) => order.OrderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  Orders: Orders; // kiểu dữ liệu là Orders

  @ManyToOne(() => Products, (product) => product.OrderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' }) // Thêm JoinColumn để xác định khóa ngoại
  Products: Products; // Kiểu dữ liệu là Products

  @ManyToOne(() => ProductSizes, (productSize) => productSize.OrderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productSizeId' }) // This should refer to the primary key in ProductSizes
  ProductSize: ProductSizes; // Tham chiếu đến ProductSizes

  @Column({ type: 'int', name: 'quantity' })
  Quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'amount' })
  Amount: number;

  @CreateDateColumn({ name: 'createdAt', nullable: false })
  CreatedAt: Date;

  @CreateDateColumn({ name: 'updatedAt', nullable: false })
  UpdatedAt: Date;
}
