import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from 'src/user/user.service';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = (request.headers.authorization || '').replace(
      /Bearer\s?/,
      '',
    );
    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_JWT_KEY);
        request.userId = decoded._id;
        return true;
      } catch (err) {
        throw new HttpException('Невалидный токен', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException(
        'Пользователь не найден',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
