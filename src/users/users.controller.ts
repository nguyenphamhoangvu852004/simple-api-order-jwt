import { Body, Controller, Put, UseGuards, Request, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UpdateUserInputDto, UpdateUserOutputDto } from './dto/update.user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GetUserByIdOutputDto } from './dto/get.user.by.id.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateUserInputDto })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully updated',
    type: UpdateUserOutputDto,
  })
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserInputDto, // Sử dụng Input DTO
  ): Promise<UpdateUserOutputDto> {
    const userId = req.user.userId; // lấy userId từ accessToken đã được giải mã
    return await this.usersService.updateUser(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile user by userId' })
  @ApiResponse({
    status: 200,
    description: 'Get User profile successfully',
    type: GetUserByIdOutputDto, // Kiểu dữ liệu trả về
  })
  async getUserById(@Request() req): Promise<GetUserByIdOutputDto> {
    const userId: number = req.user.userId;
    return await this.usersService.getUserProfileById(userId);
  }
}
