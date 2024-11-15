import {
  Body,
  Controller,
  Put,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { UpdateUserInputDto, UpdateUserOutputDto } from './dto/update.user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUserByIdOutputDto } from './dto/get.user.by.id.dto';
import { RolesGuard } from '../auth/passport/role.guard';
import { Roles } from '../auth/passport/roles.decorator';
import {
  UpdateUserByAdminInputDto,
  UpdateUserByAdminOutputDto,
} from './dto/update.user.by.admin.dto';

@Controller('')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('users')
  @Roles('admin')
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
  @Get('users')
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

  @UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guard JWT và roles
  @Get('admin/users') // Định nghĩa route API
  @ApiBearerAuth() // Chỉ ra rằng token Bearer là bắt buộc
  @ApiOperation({ summary: 'Admin - Get all users' }) // Tóm tắt mục đích API
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the list of users',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          UserID: { type: 'number', example: 1 },
          Email: { type: 'string', example: 'abyxyz@gmail.com' },
          Password: {
            type: 'string',
            example: 'hashed password',
          },
          FullName: { type: 'string', example: 'xxx xxx xxx xxx' },
          PhoneNumber: { type: 'string', example: '0182654321' },
          Address: {
            type: 'string',
            example: 'jdksafhkljdshfsdjahfQuận ksdjfkladshflkjasdjklfhlasdkjf',
          },
          CreatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-11-06T04:22:22.478Z',
          },
          UpdatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-11-06T13:07:10.476Z',
          },
          IsAdmin: { type: 'boolean', example: false },
          RefreshToken: {
            type: 'string',
            example: 'abc,xyz,jdkslajd',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin can access this endpoint',
  })
  async getUserList() {
    return await this.usersService.getUserList();
  }

  @Roles('admin') // Chỉ admin mới có quyền truy cập
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Put('admin/users')
  @ApiOperation({ summary: 'Admin update user profile' })
  @ApiBody({ type: UpdateUserByAdminInputDto })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully updated by admin',
    type: UpdateUserByAdminOutputDto,
  })
  async updateUserByAdmin(
    @Body() updateUserDto: UpdateUserByAdminInputDto,
  ): Promise<UpdateUserByAdminOutputDto> {
    return await this.usersService.updateUserByAdmin(updateUserDto);
  }

  // Route xóa người dùng chỉ dành cho admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Chỉ admin mới có thể gọi API này
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin - delete user account' })
  @Delete('admin/users/:id')
  async deleteUser(@Param('id') userId: number): Promise<void> {
    return await this.usersService.deleteUser(userId);
  }
}
