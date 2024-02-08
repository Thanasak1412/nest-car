import { UserDto } from '../users/dtos/user.dto';

export type ResponseAuth = {
  accessToken: string;
  user: UserDto;
};

export type JwtPayload = {
  sub: number;
  email: string;
  admin: boolean;
};
