import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Users } from '../typeOrm/users';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserInputDto, UpdateUserOutputDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) public userRepo: Repository<Users>) {}

  async updateUser(
    id: number,
    updateUserDto: UpdateUserInputDto, // DTO cho dữ liệu đầu vào
  ): Promise<UpdateUserOutputDto> {
    // Sử dụng Output DTO
    // Cập nhật đối tượng user với các trường có trong DTO
    const userToUpdate: Partial<Users> = {
      Email: updateUserDto.email, // Chuyển 'email' thành 'Email'
      FullName: updateUserDto.fullName, // Chuyển 'fullName' thành 'FullName'
      PhoneNumber: updateUserDto.phoneNumber, // Chuyển 'phoneNumber' thành 'PhoneNumber'
      Address: updateUserDto.address, // Chuyển 'address' thành 'Address'
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

  // findUserById(id: number) {
  //   return this.userRepo.findOne({ where: { UserID: id } });
  // }
}
