// update-user-input.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInputDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'User email address',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: false,
  })
  fullName?: string;

  @ApiProperty({
    example: '0387482641',
    description: 'User phone number',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    example: '123 Main St, Anytown',
    description: 'User address',
    required: false,
  })
  address?: string;
}

// update-user-output.dto.ts

export class UpdateUserOutputDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'User email address',
  })
  email?: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  fullName?: string;

  @ApiProperty({ example: '0348576873', description: 'User phone number' })
  phoneNumber?: string;

  @ApiProperty({ example: '123 Main St, Anytown', description: 'User address' })
  address?: string;

  @ApiProperty({
    example: '2023-10-15T13:45:30Z',
    description: 'Date when the profile was last updated',
  })
  updatedAt?: Date;
}
