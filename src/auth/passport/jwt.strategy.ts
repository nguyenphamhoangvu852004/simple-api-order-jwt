// JwtStrategy là một chiến lược xác thực sử dụng JSON Web Tokens
// (JWT) để bảo vệ các route bằng cách yêu cầu người dùng cung cấp một token hợp lệ.

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY, // Bí mật để giải mã token
    });
  }

  // Phương thức validate(payload: any) sẽ được gọi sau khi token đã được giải mã thành công.
  async validate(payload: any) {
    // Payload chứa thông tin của user sau khi token được giải mã thành công
    return { ...payload };
  }
}
