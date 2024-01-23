import { User } from 'src/users/user.entity';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, ConfigModule, TypeOrmModule.forFeature([User])],
  providers: [AuthService, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
