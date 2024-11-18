// dto/update-order-status.dto.ts
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(['InProgress', 'Resolved', 'Closed'])
  status: string;
}
