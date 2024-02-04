import * as request from 'supertest';
import { Repository } from 'typeorm';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from '../src/users/user.entity';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';

describe('Users', () => {
  let app: INestApplication;

  const usersService = {
    findOne: () => ({
      id: 1,
      email: 'test@email.com',
    }),
    updateUser: () => ({
      id: 1,
      email: 'newEmail@email.com',
    }),
    deleteUser: () => null,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useClass(Repository)
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect({
        ...usersService.findOne(),
      });
  });

  it('/ (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/users/1')
      .expect(200)
      .expect({
        ...usersService.updateUser(),
      });
  });

  it('/ (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/users/1')
      .expect(204)
      .expect({
        ...usersService.deleteUser(),
      });
  });
});
