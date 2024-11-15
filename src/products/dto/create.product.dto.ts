import { ApiProperty } from '@nestjs/swagger';

export class ProductSizeDTO {
  @ApiProperty({ example: 'Medium', description: 'Size of the product' })
  Size: 'Small' | 'Medium' | 'Large';

  @ApiProperty({
    example: 19.99,
    description: 'Price of the product for this size',
  })
  Price: number;
}

export class ProductDTO {
  @ApiProperty({ example: 'Product A', description: 'Name of the product' })
  ProductName: string;

  @ApiProperty({
    example: 'This is a description of Product A',
    description: 'Description of the product',
  })
  Description: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL of the product image',
  })
  ImageURL: string;

  @ApiProperty({
    type: [ProductSizeDTO],
    description: 'List of product sizes with prices',
  })
  ProductSizes: ProductSizeDTO[];
}
