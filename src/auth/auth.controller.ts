import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserRegisterInputDto,
  UserRegisterOutputDto,
} from './dto/user.register.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { UserLoginInputDto, UserLoginOutputDto } from './dto/user.login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' }) // Tóm tắt chức năng của endpoint
  @ApiBody({ type: UserLoginInputDto }) // Mô tả body của request nếu có (có thể cần tạo UserLoginInputDto cho req.user nếu cần)
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: UserLoginOutputDto, // Mô tả kiểu dữ liệu trả về
  })
  async login(@Request() req): Promise<UserLoginOutputDto> {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' }) // Tóm tắt chức năng của endpoint
  @ApiBody({ type: UserRegisterInputDto }) // Mô tả body của request
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserRegisterOutputDto, // Mô tả kiểu dữ liệu trả về
  })
  async register(
    @Body() registerData: UserRegisterInputDto,
  ): Promise<UserRegisterOutputDto> {
    return await this.authService.register(registerData);
  }

  @Post('token')
  async generateNewAccessToken(
    @Headers('refreshToken') refreshToken: string, // Lấy refresh token từ header
  ): Promise<string> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing');
    }

    return this.authService.generateNewAccessToken(refreshToken);
  }
}
