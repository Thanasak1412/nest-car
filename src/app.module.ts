import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import {
  configValidationAppSchema,
  configValidationDbSchema,
} from './config/config.schema';
import configuration from './config/configuration';
import { CONFIG_DB } from './constants/configuration';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
      validationSchema: configValidationAppSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          validationSchema: configValidationDbSchema,
        }),
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get(CONFIG_DB),
    }),
    UsersModule,
    ReportsModule,
    AuthModule,
  ],
})
export class AppModule {}
