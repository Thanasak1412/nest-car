import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { CurrentUserRequest } from '../types/users';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CurrentUserRequest>();

    return request.currentUser;
  },
);
