import { CurrentUserRequest } from 'src/types/users';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CurrentUserRequest>();

    return request.currentUser;
  },
);
