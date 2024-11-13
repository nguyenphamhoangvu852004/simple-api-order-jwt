import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context) {
    // Thực hiện xác thực JWT
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    // Gán thông tin người dùng vào request
    return user;
  }
  // canActivate(context: ExecutionContext) {
  //   // Add your custom authentication logic here
  //   // for example, call super.logIn(request) to establish a session.
  //   return super.canActivate(context);
  // }
  //
  // handleRequest(err, user, info) {
  //   // You can throw an exception based on either "info" or "err" arguments
  //   if (err || !user) {
  //     throw (
  //       err ||
  //       new UnauthorizedException(
  //         'Access Token not valid or not being at Headers',
  //       )
  //     );
  //   }
  //   return user;
  // }
}
