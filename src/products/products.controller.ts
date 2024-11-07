import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductDTO } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
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
}
