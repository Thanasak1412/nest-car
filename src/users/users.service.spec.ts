import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { Repository } from 'typeorm';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FindUserDto } from './dtos/find-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUserInterceptor } from './interceptor/current-user.interceptor';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

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
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create user and hash password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'Test.123fasdjfklajs',
      };

      const user = new User();
      user.id = 1;
      user.email = createUserDto.email;
      user.password = 'hash-password';

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => user.password);
      jest.spyOn(usersRepository, 'create').mockReturnValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      await usersService.create(createUserDto);

      expect(usersRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: user.password,
      });
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: user.password,
      });

      expect(await usersService.create(createUserDto)).toEqual(user);
    });

    it('should throw an error if input email is already exist', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'Test-123jklfadkcan',
      };

      const user = new User();
      user.id = 1;
      user.email = createUserDto.email;
      user.password = 'hash-password';

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return user object from id', async () => {
      const id = 1;

      const user = new User();
      user.id = 1;
      user.email = 'test@test.com';
      user.password = 'hash-password';

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const result = await usersService.findOne(id);

      expect(result).toEqual(user);
    });

    it('should throw an error if not found user from id', async () => {
      const id = 2;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('find', () => {
    it('should return an array of user', async () => {
      const findUserDto: FindUserDto = {
        email: 'test@email.com',
      };

      const user = new User();
      user.id = 1;
      user.email = findUserDto.email;
      user.password = 'hash-password';

      jest.spyOn(usersRepository, 'find').mockResolvedValue([user]);

      expect(await usersService.find(findUserDto)).toEqual([user]);
    });

    it('should throw an error if not found user', async () => {
      const findUserDto: FindUserDto = {
        email: 'test@email.conm',
      };

      jest.spyOn(usersRepository, 'find').mockResolvedValue([]);

      await expect(usersService.find(findUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update email of user', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'update@email.com',
        password: undefined,
      };

      const user = new User();
      user.id = id;
      user.email = updateUserDto.email;
      user.password = 'hash-password';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      const result = await usersService.updateUser(id, updateUserDto);

      expect(result.email).toBe(updateUserDto.email);
    });

    it('should update password of user', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        email: undefined,
        password: 'strong-password',
      };

      const user = new User();
      user.id = id;
      user.email = 'test@email.com';
      user.password = updateUserDto.password;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      const result = await usersService.updateUser(id, updateUserDto);

      expect(result.password).toBe(updateUserDto.password);
    });

    it('should throw an error if not found user from id', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        email: 'test@test.com',
        password: 'very-strong-password',
      };

      const mockFindOne = jest.fn().mockImplementation(() => {
        throw new NotFoundException(`not found user with id: ${id}`);
      });

      const mockUserRepository: Repository<User> = {
        findOne: mockFindOne,
        save: jest.fn(),
      } as unknown as Repository<User>;

      const mockUsersService = new UsersService(mockUserRepository);

      try {
        await mockUsersService.updateUser(id, updateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`not found user with id: ${id}`);
        expect(error.status).toBe(404);
      }

      expect(mockFindOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('deleteUser', () => {
    it('should delete from id', async () => {
      const id = 1;

      const user = new User();
      user.id = id;
      user.email = 'test@email.com';
      user.password = 'hash-password';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'delete').mockResolvedValue({
        raw: `DELETE FROM users where id: ${id} AND email: ${user.email} AND password: ${user.password}`,
        affected: 1,
      });

      try {
        await usersService.deleteUser(id);
      } catch (error) {
        console.error(error);
      }
      expect(usersService.findOne).toHaveBeenCalledWith(id);
      expect(usersRepository.delete).toHaveBeenCalledWith({ id, ...user });
    });

    it('should throw an error if id not found', async () => {
      const id = 99;

      const mockFindOne = jest.fn().mockImplementation(() => {
        throw new NotFoundException(`not found user with id: ${id}`);
      });

      const mockUsersRepository: Repository<User> = {
        findOne: mockFindOne,
        delete: jest.fn(),
      } as unknown as Repository<User>;

      const mockUsersService = new UsersService(mockUsersRepository);

      try {
        await mockUsersService.deleteUser(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`not found user with id: ${id}`);
        expect(error.status).toBe(404);
      }

      expect(mockFindOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
