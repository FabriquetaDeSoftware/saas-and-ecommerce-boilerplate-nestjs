import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';
import {
  productSingleData,
  productSubscriptionData,
} from '../../mocks/data/product.data';

describe('ProductsController List Many (e2e)', () => {
  let app: INestApplication;

  const types = ['single', 'subscription'];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
    const testDataSingle = productSingleData.product;
    const testDataSubs = productSubscriptionData.product;
    const listManyProductsData: ListManyProductsDto = {
      page: 1,
      pageSize: 1,
    };

    const responseSingle = await request(app.getHttpServer())
      .get(
        `/products/list-many/${types[0]}/?page=${listManyProductsData.page}&pageSize=${listManyProductsData.pageSize}`,
      )
      .expect(HttpStatus.OK);

    expect(responseSingle.body).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            public_id: testDataSingle.public_id,
            name: testDataSingle.name,
            price: testDataSingle.price,
            price_id: testDataSingle.price_id,
            image: testDataSingle.image,
            slug: testDataSingle.slug,
          }),
        ]),
        page: 1,
        pageSize: 1,
        total: 1,
        totalPages: 1,
      }),
    );

    const responseSubs = await request(app.getHttpServer())
      .get(
        `/products/list-many/${types[1]}/?page=${listManyProductsData.page}&pageSize=${listManyProductsData.pageSize}`,
      )
      .expect(HttpStatus.OK);

    expect(responseSubs.body).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            public_id: testDataSubs.public_id,
            name: testDataSubs.name,
            price: testDataSubs.price,
            price_id: testDataSubs.price_id,
            image: testDataSubs.image,
            slug: testDataSubs.slug,
          }),
        ]),
        page: 1,
        pageSize: 1,
        total: 1,
        totalPages: 1,
      }),
    );
  });

  it('Should return 400 when type is invalid', async () => {
    const invalidType = 'invalid-type';

    await request(app.getHttpServer())
      .get(`/products/list-many/${invalidType}/?page=1&pageSize=10`)
      .expect(HttpStatus.BAD_REQUEST);
  });

  afterAll(async () => {
    await app.close();
  });
});
