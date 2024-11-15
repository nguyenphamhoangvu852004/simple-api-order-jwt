import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entity/products';
import { ProductSizes } from '../entity/productSizes';

@Module({
  imports: [TypeOrmModule.forFeature([Products, ProductSizes])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
