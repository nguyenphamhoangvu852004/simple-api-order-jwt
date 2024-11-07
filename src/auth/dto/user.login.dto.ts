import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginInputDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserLoginOutputDto {
  @ApiProperty({ example: 1, description: 'User ID' }) // Mô tả trường userId
  userId: number;
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR...',
    description: 'JWT access token',
  }) // Mô tả accessToken
  accessToken: string;
  @ApiProperty({
    example: 'dGhpc19pc19hX3JlZnJlc2...',
    description: 'JWT refresh token',
  }) // Mô tả refreshToken
  refreshToken: string;
}
