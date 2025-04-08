import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { App } from 'supertest/types';

describe('PairsController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  const testUser = {
    email: 'test@example.com',
    password: '123456',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer() as App)
      .post('/v1/user')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .catch(() => {});

    const loginRes = await request(app.getHttpServer() as App)
      .post('/v1/auth/sign-in')
      .send(testUser);

    jwtToken = loginRes.body.access_token;
  });

  it('/v1/pairs/favorite (POST) deve adicionar um favorito', async () => {
    const result = await request(app.getHttpServer() as App)
      .post('/v1/pairs/favorite')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        character_id: 123,
        cat_id: 'cat-id-456',
      });

    expect(result.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
