import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (app) {
      await app.close();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return 204', async () => {
    // const response = await request(app.getHttpServer())
    //   .delete('/products/delete/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 403 when user is not ADMIN', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/delete/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 401 when user is not athorized to perfom delete operation', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/delete/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 404 when publicId of product is invalid', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/delete/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});
