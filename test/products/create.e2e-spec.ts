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

  it('Should return 201 created product', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/create/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 403 when user is not ADMIN', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/create/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 409 when there is already a product with the same slug', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/create/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 401 when user is not athorized to perfom create operation', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/create/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});
