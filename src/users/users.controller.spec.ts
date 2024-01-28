import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUserInterceptor } from './interceptor/current-user.interceptor';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('usersController', () => {
  let usersService: UsersService;
  let usersController: UsersController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: APP_INTERCEPTOR,
          useClass: CurrentUserInterceptor,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
      controllers: [UsersController],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('findUser', () => {
    it('should return the user from id', async () => {
      const id = 1;

      const user = new User();
      user.id = id;
      user.email = 'test@email.com';
      user.password = 'hash-password';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      expect(await usersController.findUser(id)).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should updated email and return updated user', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'newEmail@email.com',
        password: undefined,
      };

      const user = new User();
      user.id = id;
      user.email = updateUserDto.email;
      user.password = 'oldPassword';

      jest.spyOn(usersService, 'updateUser').mockResolvedValue(user);

      expect(await usersController.updateUser(id, updateUserDto)).toEqual(user);
    });

    it('should updated password and return updated user', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        email: undefined,
        password: 'newPassword',
      };

      const user = new User();
      user.id = id;
      user.email = 'test@email.com';
      user.password = updateUserDto.password;

      jest.spyOn(usersService, 'updateUser').mockResolvedValue(user);

      expect(await usersController.updateUser(id, updateUserDto)).toEqual(user);
    });

    it('should throw an error if email is invalid email format', async () => {
      const updateUser: UpdateUserDto = {
        email: 'test_test.com',
        password: undefined,
      };

      const updateUserDto: UpdateUserDto = plainToInstance(
        UpdateUserDto,
        updateUser,
      );

      const result = await validate(updateUserDto);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].constraints?.isEmail).toBe('email must be an email');
    });

    it('should throw an error if password is not strong', async () => {
      const updateUser: UpdateUserDto = {
        email: undefined,
        password: 'weak-password',
      };

      const updateUserDto: UpdateUserDto = plainToInstance(
        UpdateUserDto,
        updateUser,
      );

      const result = await validate(updateUserDto);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].constraints?.isStrongPassword).toBe(
        'password is not strong enough',
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user from id', () => {
      const id = 1;

      jest.spyOn(usersService, 'deleteUser').mockResolvedValue();

      usersController.deleteUser(id);

      expect(usersService.deleteUser).toHaveBeenCalledWith(id);
    });

    it('should return void', () => {
      const id = 1;

      jest.spyOn(usersService, 'deleteUser').mockResolvedValue();

      const result = usersController.deleteUser(id);

      expect(result).toBeUndefined();
    });
  });
});
