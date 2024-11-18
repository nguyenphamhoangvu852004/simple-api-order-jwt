import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrdersItems } from './ordersItems';
import { ProductSizes } from './productSizes';

@Entity({ name: 'Products' })
export class Products {
  @PrimaryGeneratedColumn({ name: 'productID' })
  ProductID: number;

  @Column({ name: 'productName' })
  ProductName: string;

  @Column({ nullable: true, name: 'description' })
  Description: string;

  @Column({ nullable: true, name: 'imageURL' })
  ImageURL: string;

  @Column({ type: 'boolean', default: true, name: 'isActive' })
  IsActive: boolean;

  // Mối quan hệ với bảng OrdersItems
  @OneToMany(() => OrdersItems, (orderItem) => orderItem.Products, {
    onDelete: 'CASCADE',
  })
  OrderItems: OrdersItems[];

  // Mối quan hệ với bảng ProductSizes
  @OneToMany(() => ProductSizes, (productSize) => productSize.ProductID, {
    onDelete: 'CASCADE',
  })
  ProductSizes: ProductSizes[];
}
