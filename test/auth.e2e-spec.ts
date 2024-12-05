import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/sign-in/ (POST)', () => {
    return request(app.getHttpServer())
      .get('/auth/sign-in/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/refresh-token/ (POST)', () => {
    return request(app.getHttpServer())
      .get('/auth/refresh-token/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/sign-up/ (POST)', () => {
    return request(app.getHttpServer())
      .get('/auth/sign-up/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/verification-code/ (POST)', () => {
    return request(app.getHttpServer())
      .get('/auth/verification-code/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/all/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/sign-up/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/admin/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/admin/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/user/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/user/')
      .expect(200)
      .expect('Hello World!');
  });
});
