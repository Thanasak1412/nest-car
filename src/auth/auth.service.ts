import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const alreadyUser = await this.usersService.find({ email });

    if (alreadyUser.length) {
      throw new ConflictException('The user already exist');
    }

    const user = await this.usersService.create(createUserDto);

    return user;
  }

  async signIn(signInDto: SignInDto): Promise<User> {
    const { email, password } = signInDto;

    const [user] = await this.usersService.find({ email });

    if (!user) {
      throw new UnauthorizedException('The email or password is incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('The email or password is incorrect');
    }

    return user;
  }
}
