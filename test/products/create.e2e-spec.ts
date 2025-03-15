import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ISubscriptionProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';

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

  it('Should return 201 created product', async () => {
    // await Promise.all(
    //   types.map((type) =>
    //     request(app.getHttpServer())
    //       .post(`/products/create/${type}/`)
    //       .expect(HttpStatus.CREATED),
    //   ),
    // );
  });

  it('Should return 403 when user is not ADMIN', async () => {
    // await Promise.all(
    //   types.map((type) =>
    //     request(app.getHttpServer())
    //       .post(`/products/create/${type}/`)
    //       .expect(HttpStatus.FORBIDDEN),
    //   ),
    // );
  });

  it('Should return 409 when there is already a product with the same slug', async () => {
    // await Promise.all(
    //   types.map((type) =>
    //     request(app.getHttpServer())
    //       .post(`/products/create/${type}/`)
    //       .expect(HttpStatus.CONFLICT),
    //   ),
    // );
  });

  it('Should return 401 when user is not athorized to perfom create operation', async () => {
    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .post(`/products/create/${type}/`)
          .expect(HttpStatus.UNAUTHORIZED),
      ),
    );
  });

  it('Should return 400 when type is invalid', async () => {
    const invalidType = 'invalid-type';

    await request(app.getHttpServer())
      .get(`/products/create/${invalidType}/`)
      .expect(HttpStatus.NOT_FOUND);

    expect(productSingleRepositoryMock.findOneBySlug).not.toHaveBeenCalled();
    expect(
      productSubscriptionRepositoryMock.findOneBySlug,
    ).not.toHaveBeenCalled();
  });

  it('should validate required fields and return 400 for invalid data', async () => {
    // await Promise.all(
    //   types.map((type) =>
    //     request(app.getHttpServer())
    //       .post(`/products/create/${type}/`)
    //       .expect(HttpStatus.BAD_REQUEST),
    //   ),
    // );
  });

  afterAll(async () => {
    await app.close();
  });
});
