import { Expose } from 'class-transformer';

import { User } from '../user.entity';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  admin: boolean;

  constructor(user: User) {
    this.id = user?.id;
    this.email = user?.email;
    this.admin = user?.admin;
  }
}
