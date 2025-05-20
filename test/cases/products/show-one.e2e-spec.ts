import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { testData } from '../../mocks/data/test.data';

describe('ProductsController Show One (e2e)', () => {
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

  it('Should return one product', async () => {
    const testDataSingle = testData.productSinglePurchase;
    const testDataSubs = testData.productSubscriptionPurchase;
    const validSlugSingle = testDataSingle.slug;
    const validSlugSubscription = testDataSubs.slug;

    const responseSingle = await request(app.getHttpServer())
      .get(`/products/show-one/${types[0]}/${validSlugSingle}/`)
      .expect(HttpStatus.OK);

    expect(responseSingle.body).toEqual(
      expect.objectContaining({
        public_id: testDataSingle.public_id,
        name: testDataSingle.name,
        description: testDataSingle.description,
        price: testDataSingle.price,
        price_id: testDataSingle.price_id,
        image: testDataSingle.image,
        slug: testDataSingle.slug,
        created_at: testDataSingle.created_at,
        updated_at: testDataSingle.updated_at,
      }),
    );

    const responseSubs = await request(app.getHttpServer())
      .get(`/products/show-one/${types[1]}/${validSlugSubscription}/`)
      .expect(HttpStatus.OK);

    expect(responseSubs.body).toEqual(
      expect.objectContaining({
        public_id: testDataSubs.public_id,
        name: testDataSubs.name,
        description: testDataSubs.description,
        price: testDataSubs.price,
        price_id: testDataSubs.price_id,
        image: testDataSubs.image,
        slug: testDataSubs.slug,
        created_at: testDataSubs.created_at,
        updated_at: testDataSubs.updated_at,
      }),
    );
  });

  it('Should return 404 when slug not exists', async () => {
    const invalidSlug = 'invalid-slug';

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .get(`/products/show-one/${type}/${invalidSlug}/`)
          .expect(HttpStatus.NOT_FOUND),
      ),
    );
  });

  it('Should return 400 when type is invalid', async () => {
    const validSlugSingle = testData.productSinglePurchase.slug;
    const invalidType = 'invalid-type';

    await request(app.getHttpServer())
      .get(`/products/show-one/${invalidType}/${validSlugSingle}/`)
      .expect(HttpStatus.BAD_REQUEST);
  });

  afterAll(async () => {
    await app.close();
  });
});
