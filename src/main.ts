import * as cookieParser from 'cookie-parser';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import {
  API_PORT,
  API_VERSION,
  COOKIE_SECRET,
} from './constants/configuration';
import { HttpExceptionFilter } from './exception/http.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const cookieSecret = configService.get(COOKIE_SECRET);

  app.setGlobalPrefix(configService.get(API_VERSION));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser(cookieSecret));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(configService.get(API_PORT));
}
bootstrap();
