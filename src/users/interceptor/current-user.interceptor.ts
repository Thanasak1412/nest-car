import { Observable } from 'rxjs';
import { CurrentUserRequest } from 'src/types/users';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<CurrentUserRequest>> {
    const request = context.switchToHttp().getRequest<CurrentUserRequest>();
    const { userId } = request.cookies || {};

    if (userId) {
      const currentUser = await this.usersService.findOne(userId);
      request.currentUser = currentUser;
    }

    return next.handle();
  }
}
