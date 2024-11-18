import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Products } from './products';
import { OrdersItems } from './ordersItems';

@Entity({ name: 'ProductSizes' })
export class ProductSizes {
  @PrimaryGeneratedColumn({ name: 'productSizeId' })
  ProductSizeID: number;

  @ManyToOne(() => Products, (product) => product.ProductSizes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  ProductID: Products;

  // Mối quan hệ với bảng OrdersItems
  @OneToMany(() => OrdersItems, (orderItem) => orderItem.ProductSize, {
    onDelete: 'CASCADE',
  })
  OrderItems: OrdersItems[];

  @Column({
    type: 'enum',
    enum: ['Small', 'Medium', 'Large'],
    name: 'size',
  })
  Size: 'Small' | 'Medium' | 'Large';

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price' })
  Price: number;
}
