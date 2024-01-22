import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signUp(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Post('signin')
  signIn(@Body() signInDto: SignInDto): Promise<User> {
    console.log('signInDto => ', signInDto);
    return this.authService.signIn(signInDto);
  }
}
