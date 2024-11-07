import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterInputDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'Password must contain uppercase, lowercase letters, and numbers',
  })
  @IsNotEmpty()
  @IsString()
  /* @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
       message: 'Password must contain uppercase, lowercase letters, and numbers',
     })*/
  password: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Confirmation of the password',
  })
  @IsNotEmpty()
  @IsString()
  passwordConfirm: string;
}

export class UserRegisterOutputDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the registration was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'Registration successful',
    description: 'Message describing the outcome',
  })
  message: string;
}
