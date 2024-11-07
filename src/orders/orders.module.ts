import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersItems } from '../typeOrm/ordersItems';
import { Orders } from '../typeOrm/orders';
import { Products } from '../typeOrm/products';
import { ProductSizes } from '../typeOrm/productSizes';
import { Users } from '../typeOrm/users';

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
