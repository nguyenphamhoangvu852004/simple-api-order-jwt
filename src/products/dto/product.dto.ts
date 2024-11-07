import { ApiProperty } from '@nestjs/swagger';

// Đặt ProductSizeDTO trước ProductDTO
export class ProductSizeDTO {
  @ApiProperty({
    description: 'Unique identifier for the product size',
    example: 1,
  })
  ProductSizeID: number;

  @ApiProperty({
    description: 'Size of the product (Small, Medium, or Large)',
    enum: ['Small', 'Medium', 'Large'],
    example: 'Medium',
  })
  Size: 'Small' | 'Medium' | 'Large';

  @ApiProperty({
    description: 'Price for the particular product size',
    example: 19.99,
  })
  Price: number;
}

export class ProductDTO {
  @ApiProperty({
    description: 'Unique identifier of the product',
    example: 1,
  })
  ProductID: number;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Product A',
  })
  ProductName: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'This is a great product.',
  })
  Description: string;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/productA.jpg',
  })
  ImageURL: string;

  @ApiProperty({
    description: 'List of sizes and prices available for the product',
    type: [ProductSizeDTO],
  })
  ProductSizes: ProductSizeDTO[];
}
