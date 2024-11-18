import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
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

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return await this.productsService.getProductById(id);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiParam({
    name: 'productID',
    description: 'The ID of the product to update',
    type: Number,
  })
  @ApiBody({ type: ModifyProductByAdminInputDto })
  @ApiOperation({ summary: 'Admin - Modify product information' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
    type: ModifyProductByAdminOutputDto,
  })
  @Put('admin/products/:productID')
  async updateProduct(
    @Param('productID') productID: number,
    @Body() updateProductDto: ModifyProductByAdminInputDto,
  ): Promise<Products> {
    return this.productsService.updateProduct(productID, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete('admin/products/:id')
  async deleteProductByAdmin(@Param('id') id: number) {
    return await this.productsService.deleteProductByAdmin(id);
  }
}
