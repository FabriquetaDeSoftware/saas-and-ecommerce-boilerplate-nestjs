import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ISubscriptionProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';
import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let productSubscriptionRepositoryMock: jest.Mocked<ISubscriptionProductsRepository>;
  let productSingleRepositoryMock: jest.Mocked<ISingleProductsRepository>;

  const validSlug = 'valid_slug';
  const invalidSlug = 'invalid_slug';
  const types = ['single', 'subscription'];

  beforeAll(async () => {
    productSingleRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue({
        id: 1,
        public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        image: 'image1.jpg',
        slug: 'product-1',
        created_at: new Date(),
        updated_at: new Date(),
      }),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(undefined),
      listMany: jest.fn().mockImplementation(undefined),
    };

    productSubscriptionRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue({
        id: 1,
        public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        image: 'image1.jpg',
        slug: 'product-1',
        created_at: new Date(),
        updated_at: new Date(),
      }),
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

  it('Should return one product', async () => {
    const listManyProductsData: ListManyProductsDto = {
      page: 1,
      pageSize: 1,
    };

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .get(`/products/show-one/${type}/${validSlug}/`)
          .expect(HttpStatus.OK),
      ),
    );

    expect(
      productSubscriptionRepositoryMock.findOneBySlug,
    ).toHaveBeenCalledWith(validSlug, { id: true });

    expect(productSingleRepositoryMock.findOneBySlug).toHaveBeenCalledWith(
      validSlug,
      { id: true },
    );
  });

  it('Should return 404 when slug not exists', async () => {
    productSingleRepositoryMock.findOneBySlug.mockResolvedValueOnce(null);
    productSubscriptionRepositoryMock.findOneBySlug.mockResolvedValueOnce(null);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .get(`/products/show-one/${type}/${invalidSlug}/`)
          .expect(HttpStatus.NOT_FOUND),
      ),
    );

    expect(productSingleRepositoryMock.findOneBySlug).toHaveBeenCalledWith(
      invalidSlug,
      { id: true },
    );

    expect(
      productSubscriptionRepositoryMock.findOneBySlug,
    ).toHaveBeenCalledWith(invalidSlug, { id: true });
  });

  it('Should return 400 when type is invalid', async () => {
    const invalidType = 'invalid-type';

    await request(app.getHttpServer())
      .get(`/products/show-one/${invalidType}/${validSlug}/`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(productSingleRepositoryMock.findOneBySlug).not.toHaveBeenCalled();
    expect(
      productSubscriptionRepositoryMock.findOneBySlug,
    ).not.toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
