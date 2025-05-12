import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { ISubscriptionProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';
import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';
import { Products } from 'src/modules/products/domain/entities/products.entity';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let productSubscriptionRepositoryMock: jest.Mocked<ISubscriptionProductsRepository>;
  let productSingleRepositoryMock: jest.Mocked<ISingleProductsRepository>;

  const imageMockURl =
    'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTEVcrypslvdUeHleSabemh-hXNLNslN-H0XVxm7ObA2J28dKoXFD5zck7QPMjyHGBCWXhq2nmA4YA0IYslGIM';

  const validSlug = 'valid_slug';
  const invalidSlug = 'invalid_slug';
  const types = ['single', 'subscription'];

  const RESPONSE_SUB_MOCK: Products = {
    id: 1,
    public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
    name: 'Product 1 Subscription',
    description: 'Description 1',
    price: 10,
    price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
    image: [imageMockURl, imageMockURl],
    slug: 'product-1',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const RESPONSE_SINGLE_MOCK: Products = {
    id: 1,
    public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
    name: 'Product 1 Single',
    description: 'Description 1',
    price: 10,
    price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
    image: [imageMockURl, imageMockURl],
    slug: 'product-1',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeAll(async () => {
    productSingleRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(RESPONSE_SINGLE_MOCK),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(undefined),
      listMany: jest.fn().mockImplementation(undefined),
    };

    productSubscriptionRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(RESPONSE_SUB_MOCK),
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
    const responses = await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .get(`/products/show-one/${type}/${validSlug}/`)
          .expect(HttpStatus.OK),
      ),
    );

    responses.map((response, index) => {
      const type = types[index];
      const expectedMock =
        type === 'subscription' ? RESPONSE_SUB_MOCK : RESPONSE_SINGLE_MOCK;

      expect(response.body).toEqual(
        expect.objectContaining({
          public_id: expectedMock.public_id,
          name: expectedMock.name,
          description: expectedMock.description,
          price: expectedMock.price,
          price_id: expectedMock.price_id,
          image: expectedMock.image,
          slug: expectedMock.slug,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      );
    });

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
