import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { CreateOrderDTO } from './dto/create.order.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' }) // Mô tả chức năng
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: {
      example: {
        message: 'Order created successfully',
        orderId: 1,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation errors',
  })
  async createOrder(
    @Body() createOrderDTO: CreateOrderDTO,
    @Request() req, // Lấy userId từ token
  ) {
    const userId = req.user.userId;
    const order = await this.ordersService.createOrder(createOrderDTO, userId);
    return {
      message: 'Order created successfully',
      orderId: order.orderId,
    };
  }

  // api lấy danh sách đơn hàng của từng khách hàng (yêu cầu trả về Mã, Ngày đặt, Trạng thái) - (khách hàng)

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user orders',
    description: 'Retrieves all orders for the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of orders with product details',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userId: { type: 'number' },
          orderId: { type: 'number' },
          status: {
            type: 'string',
            enum: ['InProgress', 'Resolved', 'Closed'],
          },
          orderCreatedAt: { type: 'string', format: 'date-time' },
          orderUpdatedAt: { type: 'string', format: 'date-time' },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                amount: { type: 'number', format: 'float' },
                imageURL: { type: 'string' },
                quantity: { type: 'number' },
                productName: { type: 'string' },
                productSize: { type: 'string' },
                productPriceFolowSize: { type: 'number', format: 'float' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Failed to retrieve user order',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @Get('usersOrders')
  async getUserOrders(@Request() req) {
    const userId = req.user.userId;
    return await this.ordersService.getUserOrders(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user orders by userId and OrderId' })
  @ApiParam({ name: 'orderId', required: true, description: 'Id of the order' })
  @ApiResponse({
    status: 201,
    description: 'Đơn hàng đã được xóa thành công',
    schema: {
      example: {
        message: 'Đơn hàng đã được xóa thành công',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation errors',
    schema: {
      example: {
        message: 'Không tìm thấy đơn hàng hoặc bạn không có quyền xóa',
      },
    },
  })
  @Delete(':orderId')
  async deleteOrder(@Request() req, @Param('orderId') orderId) {
    const { userId } = req.user;
    const result = await this.ordersService.deleteOrder(userId, orderId);
    if (result) {
      return { message: 'Đơn hàng đã được xóa thành công' };
    }
    return { message: 'Không tìm thấy đơn hàng hoặc bạn không có quyền xóa' };
  }
}
