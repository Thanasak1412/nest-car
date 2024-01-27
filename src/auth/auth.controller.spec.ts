import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Response } from 'express';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInDto } from './dtos/sign-in.dto';

describe('authController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('should return created user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'Test-123ijfklsdajkfl',
      };

      const response: Response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const user = new User();
      user.id = 1;
      user.email = createUserDto.email;
      user.password = 'strong-password';

      jest.spyOn(authService, 'signUp').mockResolvedValue(user);

      expect(
        (await authController.signUp(response, createUserDto)).email,
      ).toStrictEqual(user.email);
    });

    it('should throw error if email is incorrect email format', async () => {
      const createUser: CreateUserDto = {
        email: 'test.com',
        password: 'Test.123jklfadsjk;lfjfasdjk123',
      };

      const createUserDto: CreateUserDto = plainToInstance(
        CreateUserDto,
        createUser,
      );

      const result = await validate(createUserDto);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].constraints?.isEmail).toBe('email must be an email');
    });

    it('should throw error if password is not strong', async () => {
      const createUser: CreateUserDto = {
        email: 'email@email.com',
        password: 'password',
      };

      const createUserDto: CreateUserDto = plainToInstance(
        CreateUserDto,
        createUser,
      );

      const result = await validate(createUserDto);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].constraints?.isStrongPassword).toBe(
        'password is not strong enough',
      );
    });
  });

  describe('signIn', () => {
    it('should return the user if login correctly', async () => {
      const signInDto: SignInDto = {
        email: 'Test@email.com',
        password: 'Test.123fjasdkljfaskdjl',
      };

      const response: Response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const user = new User();
      user.id = 1;
      user.email = signInDto.email;
      user.password = 'hash-password';

      jest.spyOn(authService, 'signIn').mockResolvedValue(user);

      expect((await authController.signIn(response, signInDto)).email).toBe(
        signInDto.email,
      );
    });

    it('should throw an error if the email is incorrect email format', async () => {
      const signIn: SignInDto = {
        email: 'test_test.com',
        password: 'Test.123jfkldasjkl',
      };

      const signInDto = plainToInstance(SignInDto, signIn);

      const result = await validate(signInDto);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].constraints?.isEmail).toBe('email must be an email');
    });

    it('should throw an error if the password is not strong password', async () => {
      const signIn: SignInDto = {
        email: 'test@email.com',
        password: 'password',
      };

      const signInDto = plainToInstance(SignInDto, signIn);

      const result = await validate(signInDto);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].constraints?.isStrongPassword).toBe(
        'password is not strong enough',
      );
    });
  });
});
