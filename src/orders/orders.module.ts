import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersItems } from '../entity/ordersItems';
import { Orders } from '../entity/orders';
import { Products } from '../entity/products';
import { ProductSizes } from '../entity/productSizes';
import { Users } from '../entity/users';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      OrdersItems,
      Products,
      ProductSizes,
      Users,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
