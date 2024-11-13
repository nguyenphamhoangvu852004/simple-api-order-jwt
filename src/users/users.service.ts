import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Users } from '../entity/users';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserInputDto, UpdateUserOutputDto } from './dto/update.user.dto';
import { GetUserByIdOutputDto } from './dto/get.user.by.id.dto';

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
    return await this.userRepo.find();
  }
}
