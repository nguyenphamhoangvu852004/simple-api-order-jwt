import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from '../entity/orders';
import { Users } from '../entity/users';
import { Products } from '../entity/products';
import { ProductSizes } from '../entity/productSizes';
import { OrdersItems } from '../entity/ordersItems';
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

  async getUserOrders(userId: number) {
    const query = `
    SELECT 
      u.userId,
      o.orderId,
      o.status,
      o.createdAt AS orderCreatedAt,
      o.updatedAt AS orderUpdatedAt,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'productName', p.productName,
          'quantity', oi.quantity,
          'amount', oi.amount,
          'imageURL', p.imageURL,
          'productSize', ps.size,
          'productPriceFolowSize', ps.price
        )
      ) AS products
    FROM 
      Users u
    JOIN 
      Orders o ON u.userId = o.userId
    JOIN 
      OrdersItems oi ON o.orderId = oi.orderId
    JOIN 
      Products p ON oi.productId = p.productID
    LEFT JOIN 
      ProductSizes ps ON oi.productSizeId = ps.productSizeId
    WHERE 
      u.userId = ?
    GROUP BY 
      o.orderId;
  `;

    const orders = await this.ordersRepository.query(query, [userId]);

    return orders;
  }

  // Xóa đơn hàng
  async deleteOrder(userId: number, orderId: number): Promise<boolean> {
    // Kiểm tra đơn hàng có thuộc quyền người dùng không
    const order = await this.ordersRepository.findOne({
      where: { OrderID: orderId, User: { UserID: userId } },
      relations: ['OrderItems'], // Tải các mục trong đơn hàng
    });

    if (!order) {
      return false; // Nếu không tìm thấy đơn hàng hoặc đơn hàng không thuộc về người dùng
    }

    // Xóa các mục trong đơn hàng
    await this.ordersItemsRepository.delete({ Orders: { OrderID: orderId } });

    // Xóa đơn hàng
    await this.ordersRepository.delete({ OrderID: orderId });

    return true;
  }
}
