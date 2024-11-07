import { Body, Controller, Put, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UpdateUserInputDto, UpdateUserOutputDto } from './dto/update.user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('')
  @ApiBearerAuth() // Để Swagger biết endpoint này cần xác thực bằng JWT
  @ApiOperation({ summary: 'Update user profile' }) // Tóm tắt chức năng của endpoint
  @ApiBody({ type: UpdateUserInputDto }) // Mô tả dữ liệu trong phần body của request
  @ApiResponse({
    status: 200,
    description: 'User profile successfully updated',
    type: UpdateUserOutputDto, // Kiểu dữ liệu trả về
  })
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserInputDto, // Sử dụng Input DTO
  ): Promise<UpdateUserOutputDto> {
    // Sử dụng Output DTO
    const userId = req.user.userId; // lấy userId từ accessToken đã được giải mã

    return await this.usersService.updateUser(userId, updateUserDto);
  }
}
