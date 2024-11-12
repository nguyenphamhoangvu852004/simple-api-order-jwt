import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Quản lý sản phẩm
  @Get('users')
  getAllUser() {
    return this.adminService.getAllUsers();
  }

  @Get('products')
  getAllProducts() {}

  @Put('products/:id')
  updateProductById() {}

  @Get('products/:id')
  getProductById(@Param('id') id: string) {}

  @Delete('products/:id')
  deleteProductById(@Param('id') id: string) {}

  // Quản lý đơn hàng
  @Get('orders')
  getAllOrders() {}

  @Get('orders/:id')
  getOrderById(@Param('id') id: string) {}

  @Put('orders/:id')
  updateOrders(@Param('id') id: string) {}

  // Quản lý người dùng
  @Get('users')
  getAllUsers() {}

  @Get('users/:id')
  getUserById(@Param('id') id: string) {}

  @Put('users/:id')
  updateUserById(@Param('id') id: string) {}

  @Delete('users/:id')
  deleteUserById(@Param('id') id: string) {}
}
