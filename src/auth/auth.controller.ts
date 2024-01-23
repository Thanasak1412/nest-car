import { Response } from 'express';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

import { Body, Controller, Post, Res } from '@nestjs/common';

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
  signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.signUp(response, createUserDto);
  }

  @Post('signin')
  signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ): Promise<User> {
    return this.authService.signIn(response, signInDto);
  }
}
