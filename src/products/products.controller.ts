import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductDTO } from './dto/create.product.dto';
import { Roles } from '../auth/passport/roles.decorator';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { RolesGuard } from '../auth/passport/role.guard';
import { Products } from '../entity/products';
import {
  ModifyProductByAdminInputDto,
  ModifyProductByAdminOutputDto,
} from './dto/modify.product.by.admin';

@Controller('')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  @ApiOperation({
    summary: 'Retrieve a list of all products',
    description:
      'This endpoint retrieves a list of all available products, with basic information like name, description, and image URL.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all available products',
    type: [ProductDTO], // Chỉ rõ kiểu dữ liệu trả về là mảng ProductDTO
  })
  getAllProducts() {
    return this.productsService.getAllProductsList();
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guard JWT và roles
  @Roles('admin') // Chỉ admin mới có quyền truy cập
  @ApiBody({ type: ProductDTO })
  @ApiBearerAuth() // Chỉ ra rằng token Bearer là bắt buộc
  @ApiOperation({ summary: 'Admin - create new product' }) // Tóm tắt mục đích API
  @Post('admin/products')
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
    type: Products,
  })
  async createProduct(@Body() productDto: ProductDTO): Promise<Products> {
    // @ts-ignore
    return this.productsService.createProduct(productDto);
  }

  @Roles('admin') // Chỉ admin mới có quyền truy cập
  @UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guard JWT và roles
  @ApiBody({ type: ModifyProductByAdminInputDto })
  @ApiOperation({ summary: 'Admin - modify product info' }) // Tóm tắt mục đích API
  @ApiBearerAuth() // Chỉ ra rằng token Bearer là bắt buộc
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: ModifyProductByAdminOutputDto,
  })
  @Put('admin/products')
  async modifyProductByAdmin(@Body() productDto: ModifyProductByAdminInputDto) {
    return this.productsService.modifyProductByAdmin(productDto);
  }
}
