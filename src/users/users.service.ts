import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from '../auth/dtos/create-user.dto';
import { FindUserDto } from './dtos/find-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const userExist = await this.userRepository.findOne({ where: { email } });

    if (userExist) {
      throw new ConflictException(`User is already exist: ${email}`);
    }

    const saltOrRound = 10;

    const salt = await bcrypt.genSalt(saltOrRound);

    const hashPassword = await bcrypt.hash(createUserDto.password, salt);

    const createUser = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
    });

    return this.userRepository.save(createUser);
  }

  async findOne(id: number): Promise<User> {
    const find = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!find) {
      throw new NotFoundException(`not found user with id: ${id}`);
    }

    return find;
  }

  async find(findUserDto: FindUserDto): Promise<User[]> {
    const { email } = findUserDto;

    const findUsers = await this.userRepository.find({
      where: {
        email,
      },
    });

    if (!findUsers.length) {
      throw new NotFoundException(`not found user with email: ${email}`);
    }

    return findUsers;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, password } = updateUserDto;
    const user = await this.findOne(id);

    const updatedUser = {
      ...user,
      email,
      password,
    };

    return this.userRepository.save(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOne(id);

    await this.userRepository.delete({ id, ...user });
  }
}
