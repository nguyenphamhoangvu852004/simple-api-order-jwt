// update-user-by-admin-input.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserByAdminInputDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  fullname?: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ required: false })
  address?: string;
}

export class UpdateUserByAdminOutputDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  fullname?: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
