import { IsInt, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'; // Thêm ApiProperty để Swagger hiểu các trường

class OrderItemDTO {
  @ApiProperty({
    description: 'ID of the product being ordered',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'ID of the product size for the ordered product',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  productSizeId: number;

  @ApiProperty({
    description: 'Quantity of the product being ordered',
    example: 3,
  })
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDTO {
  @ApiProperty({
    description: 'List of items in the order',
    type: [OrderItemDTO], // Chỉ ra rằng đây là một mảng các item
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];
}
