import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configValidateJwtSchema } from '../config/config.schema';
import configuration from '../config/configuration';
import { JWT_EXPIRED, JWT_SECRET } from '../constants/configuration';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          load: [configuration],
          validationSchema: configValidateJwtSchema,
        }),
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>(JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(JWT_EXPIRED),
        },
      }),
    }),
  ],
  providers: [AuthService, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
