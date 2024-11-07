import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../typeOrm/users';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  comparePassword,
} from '../helps/utils';
import { UserLoginOutputDto } from './dto/user.login.dto';
import {
  UserRegisterInputDto,
  UserRegisterOutputDto,
} from './dto/user.register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) public userRepo: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user: Users = await this.userRepo.findOne({
      where: { Email: email },
    });
    if (!user) return null;
    const isValidPassword: boolean = await comparePassword(
      password,
      user.Password,
    );
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: Users): Promise<UserLoginOutputDto> {
    // Tạo payload
    const payload: object = {
      userId: user.UserID,
      email: user.Email,
      address: user.Address || null,
      role: user.IsAdmin ? 'admin' : 'user',
    };
    // Tạo refresh token
    const refreshToken = await generateRefreshToken(this.jwtService, payload);

    // Lưu refresh token vào cơ sở dữ liệu
    user.RefreshToken = refreshToken; // Giả sử bạn có trường RefreshToken trong model Users
    await this.userRepo.save(user); // Lưu thông tin user (bao gồm refresh token)

    // Trả về 2 token
    return {
      userId: user.UserID,
      accessToken: await generateAccessToken(this.jwtService, payload),
      refreshToken: refreshToken, // Trả về refresh token
    };
  }

  async register(xyz: UserRegisterInputDto): Promise<UserRegisterOutputDto> {
    const { email, phoneNumber, password, passwordConfirm } = xyz;

    // Kiem tra email co ton tai chua
    const existingUser: Users = await this.userRepo.findOne({
      where: { Email: email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists'); // 409 Conflict
    }

    // Kiem tra 2 password co trung nhau khong
    if (password.trim() !== passwordConfirm.trim()) {
      throw new BadRequestException('Passwords do not match'); // 400 Bad Request
    }

    const passwordAfterHash: string = await hashPassword(password);
    const newUser: Users = this.userRepo.create({
      Email: email,
      PhoneNumber: phoneNumber,
      Password: passwordAfterHash,
    });
    await this.userRepo.save(newUser);

    return {
      success: true,
      message: 'Registration successful',
    };
  }

  async generateNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      });

      // Loại bỏ thuộc tính exp nếu có
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { exp, ...restPayload } = payload;

      // Tạo access token mới với payload đã được loại bỏ exp
      return await generateAccessToken(this.jwtService, restPayload);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
