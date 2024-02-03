import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import helmet from 'helmet';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AppModule } from './app.module';
import {
  API_CORS_OPTIONS,
  API_PORT,
  API_VERSION,
  COOKIE_SECRET,
  SESSION_SECRET,
} from './constants/configuration';
import { HttpExceptionFilter } from './exception/http.exception';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const jwtService = app.get(JwtService);
  const cookieSecret = configService.get(COOKIE_SECRET);

  app.enableCors(configService.get(API_CORS_OPTIONS));
  app.use(helmet());
  app.setGlobalPrefix(configService.get(API_VERSION));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser(cookieSecret));
  app.use(
    session({
      secret: configService.get(SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalGuards(new AuthGuard(jwtService, configService));

  await app.listen(configService.get(API_PORT));
}
bootstrap();
