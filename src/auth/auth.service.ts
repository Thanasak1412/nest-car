import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { COOKIE_OPTIONS } from '../constants/configuration';
import { USER_ID } from '../constants/user';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async signUp(
    response: Response,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const { email } = createUserDto;

    const userExist = await this.usersRepository.find({ where: { email } });

    if (userExist.length) {
      throw new ConflictException('The user already exist');
    }

    const user = await this.usersService.create(createUserDto);

    response.cookie(USER_ID, user.id, this.configService.get(COOKIE_OPTIONS));

    return user;
  }

  async signIn(response: Response, signInDto: SignInDto): Promise<User> {
    const { email, password } = signInDto;

    const [user] = await this.usersService.find({ email });

    if (!(user || (await bcrypt.compare(password, user.password)))) {
      throw new UnauthorizedException('The email or password is incorrect');
    }

    response.cookie(USER_ID, user.id, this.configService.get(COOKIE_OPTIONS));

    return user;
  }
}
