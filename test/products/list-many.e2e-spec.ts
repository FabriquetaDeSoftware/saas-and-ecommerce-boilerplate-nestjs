import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products/list-many/ (Get)', async () => {
    // const response = await request(app.getHttpServer())
    //   .get('/products/list-many/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});
