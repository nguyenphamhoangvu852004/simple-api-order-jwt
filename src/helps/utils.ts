import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';

// Hàm hash mật khẩu
export const hashPassword = async (password: string): Promise<string> => {
  const saltRound = 9;
  return await bcrypt.hash(password, saltRound);
};

// Hàm tạo access token
export const generateAccessToken = async (
  jwtService: JwtService,
  payload: any,
): Promise<string> => {
  return jwtService.signAsync(payload, {
    secret: process.env.ACCESS_TOKEN_SECRET_KEY,
    expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY),
  });
};

// Hàm tạo refresh token
export const generateRefreshToken = async (
  jwtService: JwtService,
  payload: any,
): Promise<string> => {
  return jwtService.signAsync(payload, {
    secret: process.env.REFRESH_TOKEN_SECRET_KEY,
    expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY),
  });
};

export const comparePassword = async (pass: string, hashedPassword: string) => {
  try {
    return bcrypt.compareSync(pass, hashedPassword);
  } catch (e) {
    console.error(e);
  }
};
