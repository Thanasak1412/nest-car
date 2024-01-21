import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Serialize } from '../interceptor/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  signUp(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get(':id')
  findUser(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: number) {
    this.usersService.deleteUser(id);
  }
}
