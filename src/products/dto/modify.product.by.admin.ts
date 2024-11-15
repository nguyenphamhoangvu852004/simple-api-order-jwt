import { ApiProperty } from '@nestjs/swagger';

export class ModifyProductByAdminInputDto {
  @ApiProperty({ description: 'ID của sản phẩm cần sửa' })
  productID: number;

  @ApiProperty({ description: 'Tên sản phẩm' })
  productName: string;

  @ApiProperty({ description: 'Mô tả sản phẩm' })
  description: string;

  @ApiProperty({ description: 'URL hình ảnh của sản phẩm' })
  imageURL: string;

  @ApiProperty({ description: 'Trạng thái kích hoạt sản phẩm' })
  isActive: boolean;

  @ApiProperty({
    description: 'Giá cho kích thước Small (nếu có)',
    required: false,
  })
  priceSmall?: number;

  @ApiProperty({
    description: 'Giá cho kích thước Medium (nếu có)',
    required: false,
  })
  priceMedium?: number;

  @ApiProperty({
    description: 'Giá cho kích thước Large (nếu có)',
    required: false,
  })
  priceLarge?: number;
}

export class ModifyProductByAdminOutputDto {
  @ApiProperty({ description: 'ID của sản phẩm' })
  productID: number;

  @ApiProperty({ description: 'Tên sản phẩm' })
  productName: string;

  @ApiProperty({ description: 'Mô tả sản phẩm' })
  description: string;

  @ApiProperty({ description: 'URL hình ảnh của sản phẩm' })
  imageURL: string;

  @ApiProperty({ description: 'Trạng thái kích hoạt sản phẩm' })
  isActive: boolean;

  @ApiProperty({
    description: 'Danh sách các kích thước sản phẩm và giá của chúng',
    type: [Object],
    example: [{ productSizeID: 1, size: 'Small', price: 10 }],
  })
  productSizes: {
    productSizeID: number;
    size: string;
    price: number;
  }[];
}
