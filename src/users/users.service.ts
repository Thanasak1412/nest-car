import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(email: string, password: string): Promise<User> {
    const createUser = this.userRepository.create({
      email,
      password,
    });

    return this.userRepository.save(createUser);
  }
}
