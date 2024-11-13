import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) {
      return true; // Không yêu cầu quyền đặc biệt, cho phép truy cập
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true; // Người dùng có quyền truy cập
  }
}
