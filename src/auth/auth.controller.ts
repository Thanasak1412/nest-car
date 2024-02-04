import { Response } from 'express';

import { Body, Controller, Post, Res } from '@nestjs/common';

import { ResponseAuth } from '../types/auth';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseAuth> {
    return this.authService.signUp(response, createUserDto);
  }

  @Post('signin')
  signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ): Promise<ResponseAuth> {
    return this.authService.signIn(response, signInDto);
  }
}
