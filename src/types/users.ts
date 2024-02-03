import { Request } from 'express';

import { UserDto } from '../users/dtos/user.dto';

export interface CurrentUserRequest extends Request {
  user: UserDto;
}
