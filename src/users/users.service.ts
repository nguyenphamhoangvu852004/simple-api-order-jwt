import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../entity/users';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserInputDto, UpdateUserOutputDto } from './dto/update.user.dto';
import { GetUserByIdOutputDto } from './dto/get.user.by.id.dto';
import {
  UpdateUserByAdminInputDto,
  UpdateUserByAdminOutputDto,
} from './dto/update.user.by.admin.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) public userRepo: Repository<Users>) {}

  async updateUser(
    id: number,
    updateUserDto: UpdateUserInputDto, // DTO cho dữ liệu đầu vào
  ): Promise<UpdateUserOutputDto> {
    const userToUpdate: Partial<Users> = {
      Email: updateUserDto.email,
      FullName: updateUserDto.fullName,
      PhoneNumber: updateUserDto.phoneNumber,
      Address: updateUserDto.address,
    };

    // Cập nhật người dùng
    await this.userRepo.update(id, userToUpdate);

    // Lấy lại thông tin người dùng đã được cập nhật
    const updatedUser = await this.userRepo.findOne({ where: { UserID: id } });

    // Trả về thông tin người dùng sau khi cập nhật
    return {
      email: updatedUser.Email,
      fullName: updatedUser.FullName,
      phoneNumber: updatedUser.PhoneNumber,
      address: updatedUser.Address,
      updatedAt: updatedUser.UpdatedAt, // Nếu muốn trả về thời gian cập nhật
    };
  }

  async getUserProfileById(userId: number): Promise<GetUserByIdOutputDto> {
    const response = await this.userRepo.findOne({ where: { UserID: userId } });
    const getUserByIdOutputDto: GetUserByIdOutputDto =
      new GetUserByIdOutputDto();
    getUserByIdOutputDto.userId = response.UserID;
    getUserByIdOutputDto.fullname = response.FullName
      ? response.FullName
      : null;
    getUserByIdOutputDto.address = response.Address ? response.Address : null;
    getUserByIdOutputDto.phoneNumber = response.PhoneNumber
      ? response.PhoneNumber
      : null;
    return getUserByIdOutputDto;
  }

  async getUserList() {
    return await this.userRepo.find({
      where: {
        IsAdmin: false,
      },
    });
  }

  // users.service.ts
  async updateUserByAdmin(
    updateUserDto: UpdateUserByAdminInputDto,
  ): Promise<UpdateUserByAdminOutputDto> {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await this.userRepo.findOne({
      where: { UserID: updateUserDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật các trường trong người dùng từ DTO
    user.Email = updateUserDto.email || user.Email;
    user.FullName = updateUserDto.fullname || user.FullName;
    user.PhoneNumber = updateUserDto.phoneNumber || user.PhoneNumber;
    user.Address = updateUserDto.address || user.Address;

    // Lưu thông tin người dùng đã được cập nhật vào cơ sở dữ liệu
    const updatedUser = await this.userRepo.save(user);

    // Trả về Output DTO
    const output: UpdateUserByAdminOutputDto = {
      userId: updatedUser.UserID,
      email: updatedUser.Email,
      fullname: updatedUser.FullName,
      phoneNumber: updatedUser.PhoneNumber,
      address: updatedUser.Address,
      isAdmin: updatedUser.IsAdmin,
      createdAt: updatedUser.CreatedAt,
      updatedAt: updatedUser.UpdatedAt,
    };

    return output; // Trả về Output DTO
  }

  // Phương thức xóa người dùng
  async deleteUser(userId: number): Promise<void> {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await this.userRepo.findOne({ where: { UserID: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Xóa người dùng
    await this.userRepo.delete(userId);
  }
}
