import { Response } from 'express';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { USER_ID } from '../src/constants/user';
import { User } from '../src/users/user.entity';

describe('Auth', () => {
  let app: INestApplication;
  const authService = {
    signUp: () => ({
      accessToken: 'fake-token',
      user: {
        id: 1,
        email: 'test@email.com',
      },
    }),
    signIn: () => ({
      accessToken: 'fake-token',
      user: {
        id: 1,
        email: 'test@email.com',
      },
    }),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useClass(Repository)
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  it('/signup (POST)', () => {
    const res = request(app.getHttpServer())
      .post('/auth/signup')
      .set('Cookie', ['userId=1'])
      .expect(HttpStatus.CREATED)
      .expect({
        ...authService.signUp(),
      }) as unknown as Response;

    const userCookie = res.header['Cookie'].find((cookie: string) =>
      cookie.includes(USER_ID),
    );

    expect(userCookie).toBe(`${USER_ID}=${authService.signUp().user.id}`);

    return res;
  });

  it('/signin (POST)', () => {
    const res = request(app.getHttpServer())
      .post('/auth/signin')
      .set('Cookie', ['userId=1'])
      .expect(HttpStatus.OK)
      .expect({
        ...authService.signIn(),
      }) as unknown as Response;

    const userCookie = res.header['Cookie'].find((cookie: string) =>
      cookie.includes(USER_ID),
    );

    expect(userCookie).toBe(`${USER_ID}=${authService.signIn().user.id}`);

    return res;
  });
});
