import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { COOKIE_OPTIONS, JWT_SECRET } from '../constants/configuration';
import { USER_ID } from '../constants/user';
import { JwtPayload, ResponseAuth } from '../types/auth';
import { UserDto } from '../users/dtos/user.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    response: Response,
    createUserDto: CreateUserDto,
  ): Promise<ResponseAuth> {
    const user = await this.usersService.create(createUserDto);

    response.cookie(USER_ID, user.id, this.configService.get(COOKIE_OPTIONS));

    const userDto = new UserDto(user);

    return {
      accessToken: await this.signToken(user),
      user: userDto,
    };
  }

  async signIn(
    response: Response,
    signInDto: SignInDto,
  ): Promise<ResponseAuth> {
    const { email, password } = signInDto;

    const [user] = await this.usersService.find({ email });

    if (!user || !(await bcrypt.compare(password, user?.password))) {
      throw new UnauthorizedException('The email or password is incorrect');
    }

    response.cookie(USER_ID, user.id, this.configService.get(COOKIE_OPTIONS));

    const userDto = new UserDto(user);

    return {
      accessToken: await this.signToken(user),
      user: userDto,
    };
  }

  private signToken(user: User): Promise<string> {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get(JWT_SECRET),
    });
  }
}
