import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';
import { ISubscriptionProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let productSubscriptionRepositoryMock: jest.Mocked<ISubscriptionProductsRepository>;
  let productSingleRepositoryMock: jest.Mocked<ISingleProductsRepository>;

  const types = ['single', 'subscription'];

  beforeAll(async () => {
    productSingleRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(undefined),
      listMany: jest.fn().mockImplementation(undefined),
    };

    productSubscriptionRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(undefined),
      listMany: jest.fn().mockImplementation(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('ISingleProductsRepository')
      .useValue(productSingleRepositoryMock)
      .overrideProvider('ISubscriptionProductsRepository')
      .useValue(productSubscriptionRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return 204 delete product', async () => {
    // const response = await request(app.getHttpServer())
    //   .delete('/products/delete/:type/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 403 when user is not ADMIN', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/delete/:type/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 401 when user is not athorized to perfom delete operation', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/delete/:type/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 404 when product not found', async () => {
    // const response = await request(app.getHttpServer())
    //   .post('/products/delete/:type/:publicId/')
    //   .expect(200)
    //   .expect('Hello World!');
  });

  it('Should return 400 when type is invalid', async () => {});

  afterAll(async () => {
    await app.close();
  });
});
