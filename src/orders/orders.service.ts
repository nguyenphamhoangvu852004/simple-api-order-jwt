import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from '../typeOrm/orders';
import { Users } from '../typeOrm/users';
import { Products } from '../typeOrm/products';
import { ProductSizes } from '../typeOrm/productSizes';
import { OrdersItems } from '../typeOrm/ordersItems';
import { CreateOrderDTO } from './dto/create.order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(ProductSizes)
    private readonly productSizesRepository: Repository<ProductSizes>,
    @InjectRepository(OrdersItems)
    private readonly ordersItemsRepository: Repository<OrdersItems>,
  ) {}

  async createOrder(createOrderDTO: CreateOrderDTO, userId: number) {
    // Tìm người dùng dựa trên userId
    const user = await this.usersRepository.findOneBy({ UserID: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Tạo đơn hàng mới
    const order = this.ordersRepository.create({
      User: user,
      Status: 'InProgress',
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    });
    await this.ordersRepository.save(order);

    // Tạo các order items từ các item trong createOrderDTO
    const orderItems = await Promise.all(
      createOrderDTO.items.map(async (item) => {
        const product = await this.productsRepository.findOneBy({
          ProductID: item.productId,
        });
        if (!product) {
          throw new Error('Product not found');
        }

        const productSize = await this.productSizesRepository.findOneBy({
          ProductSizeID: item.productSizeId,
        });
        if (!productSize) {
          throw new Error('Product size not found');
        }

        const orderItem = this.ordersItemsRepository.create({
          Orders: order,
          Products: product,
          ProductSize: productSize,
          Quantity: item.quantity,
          Amount: productSize.Price * item.quantity, // Giả sử Price là giá sản phẩm
          CreatedAt: new Date(),
          UpdatedAt: new Date(),
        });

        await this.ordersItemsRepository.save(orderItem);
        return orderItem;
      }),
    );

    // Cập nhật lại đơn hàng với các order items
    order.OrderItems = orderItems;
    await this.ordersRepository.save(order);

    return {
      orderId: order.OrderID, // Trả về ID của đơn hàng đã tạo
      status: 'success',
      message: 'Order created successfully',
    };
  }
}
