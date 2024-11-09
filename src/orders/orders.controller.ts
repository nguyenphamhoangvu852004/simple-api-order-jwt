import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { CreateOrderDTO } from './dto/create.order.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth() // Để Swagger biết endpoint này cần xác thực bằng JWT
  @ApiOperation({ summary: 'Create a new order' }) // Mô tả chức năng
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: {
      example: {
        message: 'Order created successfully',
        orderId: 1, // Ví dụ ID của đơn hàng
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
}
