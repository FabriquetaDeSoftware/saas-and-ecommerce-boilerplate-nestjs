import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ISubscriptionProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';
import { ListManyProductsReturn } from 'src/modules/products/domain/interfaces/returns/list_many_products_return.interface';
import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let productSubscriptionRepositoryMock: jest.Mocked<ISubscriptionProductsRepository>;
  let productSingleRepositoryMock: jest.Mocked<ISingleProductsRepository>;

  const imageMockURl =
    'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTEVcrypslvdUeHleSabemh-hXNLNslN-H0XVxm7ObA2J28dKoXFD5zck7QPMjyHGBCWXhq2nmA4YA0IYslGIM';

  const RESPONSE_SUB_MOCK: ListManyProductsReturn = {
    data: [
      {
        id: 1,
        public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
        image: [imageMockURl, imageMockURl],
        slug: 'product-1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
        name: 'Product 2',
        description: 'Description 2',
        price: 10,
        price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
        image: [imageMockURl, imageMockURl],
        slug: 'product-1',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    page: 1,
    pageSize: 1,
    total: 2,
    totalPages: 2,
  };
  const RESPONSE_SINGLE_MOCK: ListManyProductsReturn = {
    data: [
      {
        id: 1,
        public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
        image: [imageMockURl, imageMockURl],
        slug: 'product-1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
        name: 'Product 2',
        description: 'Description 2',
        price: 10,
        price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
        image: [imageMockURl, imageMockURl],
        slug: 'product-1',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    page: 1,
    pageSize: 1,
    total: 2,
    totalPages: 2,
  };

  const types = ['single', 'subscription'];

  beforeAll(async () => {
    productSingleRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(undefined),
      listMany: jest
        .fn()
        .mockImplementation(
          (dto: ListManyProductsDto): Promise<ListManyProductsReturn> =>
            Promise.resolve(RESPONSE_SINGLE_MOCK),
        ),
    };

    productSubscriptionRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(undefined),
      listMany: jest
        .fn()
        .mockImplementation(
          (dto: ListManyProductsDto): Promise<ListManyProductsReturn> =>
            Promise.resolve(RESPONSE_SUB_MOCK),
        ),
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

  it('Should return products[]', async () => {
    const listManyProductsData: ListManyProductsDto = {
      page: 1,
      pageSize: 1,
    };

    const responses = await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .get(
            `/products/list-many/${type}/?page=${listManyProductsData.page}&pageSize=${listManyProductsData.pageSize}`,
          )
          .expect(HttpStatus.OK),
      ),
    );

    responses.map((response) => {
      expect(response.body).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
              name: 'Product 1',
              description: 'Description 1',
              price: 10,
              price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
              image: [imageMockURl, imageMockURl],
              slug: 'product-1',
            }),
            expect.objectContaining({
              public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
              name: 'Product 2',
              description: 'Description 2',
              price: 10,
              price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
              image: [imageMockURl, imageMockURl],
              slug: 'product-1',
            }),
          ]),
          page: 1,
          pageSize: 1,
          total: 2,
          totalPages: 2,
        }),
      );
    });

    expect(productSubscriptionRepositoryMock.listMany).toHaveBeenCalledWith(
      undefined,
      listManyProductsData.page - 1,
      listManyProductsData.pageSize,
      { created_at: true, description: true, id: true, updated_at: true },
    );

    expect(productSingleRepositoryMock.listMany).toHaveBeenCalledWith(
      undefined,
      listManyProductsData.page - 1,
      listManyProductsData.pageSize,
      { created_at: true, description: true, id: true, updated_at: true },
    );
  });

  it('Should return empty array', async () => {
    productSingleRepositoryMock.listMany.mockResolvedValueOnce({
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    });

    productSubscriptionRepositoryMock.listMany.mockResolvedValueOnce({
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    });

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .get(`/products/list-many/${type}/?page=1&pageSize=10`)
          .expect(HttpStatus.OK)
          .expect((res) => {
            expect(res.body.data).toHaveLength(0);
            expect(res.body.total).toBe(0);
          }),
      ),
    );
  });

  it('Should return 400 when type is invalid', async () => {
    const invalidType = 'invalid-type';

    await request(app.getHttpServer())
      .get(`/products/list-many/${invalidType}/?page=1&pageSize=10`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(productSingleRepositoryMock.listMany).not.toHaveBeenCalled();
    expect(productSubscriptionRepositoryMock.listMany).not.toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
