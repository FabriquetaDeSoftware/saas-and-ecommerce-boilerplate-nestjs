import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return updated product', async () => {
    // const response = await request(app.getHttpServer())
    //   .patch('/products/update/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 403 when user is not ADMIN', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/update/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 401 when user is not athorized to perfom update operation', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/update/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 404 when product not found', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/update/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 400 when type is invalid', async () => {});

  it('should validate required fields and return 400 for invalid data', async () => {});

  afterAll(async () => {
    await app.close();
  });
});
