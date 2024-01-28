import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Repository } from 'typeorm';

import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { COOKIE_OPTIONS } from '../constants/configuration';
import { USER_ID } from '../constants/user';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let configService: ConfigService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    usersRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('signUp', () => {
    it('should create a new user and set the cookie', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@email.com',
        password: 'test-123j21k3jkfjad',
      };

      const user = new User();
      user.id = 1;
      user.email = createUserDto.email;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(user);

      const response: Response = {
        cookie: jest.fn(),
      } as unknown as Response;

      await authService.signUp(response, createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(response.cookie).toHaveBeenCalledWith(
        USER_ID,
        user.id,
        configService.get(COOKIE_OPTIONS),
      );
    });

    it('should throw conflict exception if the user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@email.com',
        password: 'Test-1231jhkfjdaksjkf',
      };

      const user = new User();
      user.id = 1;
      user.email = createUserDto.email;
      user.password = createUserDto.email;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const response: Response = {
        cookie: jest.fn(),
      } as unknown as Response;

      await expect(authService.signUp(response, createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('signIn', () => {
    it('should sign in the user and set the cookie', async () => {
      const signInDto: SignInDto = {
        email: 'test@email.com',
        password: 'Test-123jklfadsjkf',
      };

      const response: Response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const user = new User();
      user.id = 1;
      user.email = signInDto.email;
      user.password = signInDto.password;

      jest.spyOn(usersService, 'find').mockResolvedValue([user]);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      await authService.signIn(response, signInDto);

      const [findUser] = await usersService.find({ email: signInDto.email });

      expect(usersService.find).toHaveBeenCalledWith({
        email: signInDto.email,
      });
      expect(findUser.email).toEqual(signInDto.email);
      expect(response.cookie).toHaveBeenCalledWith(
        USER_ID,
        user.id,
        configService.get(COOKIE_OPTIONS),
      );
    });

    it('should throw new unauthorized if the email is incorrect', async () => {
      const signInDto: SignInDto = {
        email: 'test@test.com',
        password: 'Test.asdjfk123fdjskaf',
      };

      const response: Response = {
        cookie: jest.fn(),
      } as unknown as Response;

      jest.spyOn(usersService, 'find').mockResolvedValue([]);

      await expect(authService.signIn(response, signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw unauthorized if the password is incorrect', async () => {
      const signInDto: SignInDto = {
        email: 'Test@email.com',
        password: 'password',
      };

      const response: Response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const user = new User();
      user.id = 1;
      user.email = signInDto.email;
      user.password = 'hash-password';

      jest.spyOn(usersService, 'find').mockResolvedValue([user]);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(authService.signIn(response, signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
