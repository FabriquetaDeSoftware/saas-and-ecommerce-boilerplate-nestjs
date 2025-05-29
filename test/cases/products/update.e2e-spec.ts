import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { UpdateProductInfoDto } from 'src/modules/products/application/dto/update_product_info.dto';
import { testData } from '../../mocks/data/test.data';

describe('ProductsController Update (e2e)', () => {
  let app: INestApplication;

  const imageMockURl =
    'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTEVcrypslvdUeHleSabemh-hXNLNslN-H0XVxm7ObA2J28dKoXFD5zck7QPMjyHGBCWXhq2nmA4YA0IYslGIM';

  const VALID_PRODUCT_DATA: UpdateProductInfoDto = {
    name: 'product name',
    description: 'the best product',
    price: 12345,
    price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
    slug: 'slug_product1',
    image: [imageMockURl, imageMockURl],
  };

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

  it('Should return updated product', async () => {
    const adminToken = testData.tokensReturnsAdmin.access_token;
    const testDataSingle = testData.productSinglePurchase;
    const testDataSubs = testData.productSubscriptionPurchase;
    const productSingleId = testDataSingle.public_id;
    const productSubsId = testDataSubs.public_id;

    const responseSingle = await request(app.getHttpServer())
      .patch(`/products/update/${types[0]}/${productSingleId}/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(VALID_PRODUCT_DATA)
      .expect(HttpStatus.OK);

    testDataSingle.public_id = responseSingle.body.public_id;
    testDataSingle.name = responseSingle.body.name;
    testDataSingle.description = responseSingle.body.description;
    testDataSingle.price = responseSingle.body.price;
    testDataSingle.image = responseSingle.body.image;
    testDataSingle.slug = responseSingle.body.slug;
    testDataSingle.price_id = responseSingle.body.price_id;
    testDataSingle.created_at = responseSingle.body.created_at;
    testDataSingle.updated_at = responseSingle.body.updated_at;

    const responseSubs = await request(app.getHttpServer())
      .patch(`/products/update/${types[1]}/${productSubsId}/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(VALID_PRODUCT_DATA)
      .expect(HttpStatus.OK);

    testDataSubs.public_id = responseSubs.body.public_id;
    testDataSubs.name = responseSubs.body.name;
    testDataSubs.description = responseSubs.body.description;
    testDataSubs.price = responseSubs.body.price;
    testDataSubs.image = responseSubs.body.image;
    testDataSubs.slug = responseSubs.body.slug;
    testDataSubs.price_id = responseSubs.body.price_id;
    testDataSubs.created_at = responseSubs.body.created_at;
    testDataSubs.updated_at = responseSubs.body.updated_at;
  });

  it('Should return 401 when user is not athorized to perfom update operation', async () => {
    const notPerformerToken = testData.tokensReturnsUser.access_token;

    await request(app.getHttpServer())
      .patch(
        `/products/update/${types[0]}/${testData.productSinglePurchase.public_id}/`,
      )
      .set('Authorization', `Bearer ${notPerformerToken}`)
      .send(VALID_PRODUCT_DATA)
      .expect(HttpStatus.UNAUTHORIZED);

    await request(app.getHttpServer())
      .patch(
        `/products/update/${types[1]}/${testData.productSubscriptionPurchase.public_id}/`,
      )
      .set('Authorization', `Bearer ${notPerformerToken}`)
      .send(VALID_PRODUCT_DATA)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('Should return 404 when product not found', async () => {
    const adminToken = testData.tokensReturnsAdmin.access_token;

    const [,] = await Promise.all([
      request(app.getHttpServer())
        .delete(
          `/products/update/${types[0]}/${testData.productSinglePurchase.public_id}/`,
        )
        .set('Authorization', `Bearer ${adminToken}`)
        .send(VALID_PRODUCT_DATA)
        .expect(HttpStatus.NOT_FOUND),

      request(app.getHttpServer())
        .delete(
          `/products/update/${types[1]}/${testData.productSubscriptionPurchase.public_id}/`,
        )
        .set('Authorization', `Bearer ${adminToken}`)
        .send(VALID_PRODUCT_DATA)
        .expect(HttpStatus.NOT_FOUND),
    ]);
  });

  it('Should return 400 when type is invalid', async () => {
    const adminToken = testData.tokensReturnsAdmin.access_token;

    await request(app.getHttpServer())
      .patch(
        `/products/update/invalid-type/${testData.productSinglePurchase.public_id}/`,
      )
      .set('Authorization', `Bearer ${adminToken}`)
      .send(VALID_PRODUCT_DATA)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should validate required fields and return 400 for invalid data', async () => {
    const adminToken = testData.tokensReturnsAdmin.access_token;

    const [,] = await Promise.all([
      request(app.getHttpServer())
        .patch(
          `/products/update/${types[0]}/${testData.productSinglePurchase.public_id}/`,
        )
        .set('Authorization', `Bearer ${adminToken}`)
        .send('invalid data')
        .expect(HttpStatus.BAD_REQUEST),

      request(app.getHttpServer())
        .patch(
          `/products/update/${types[1]}/${testData.productSubscriptionPurchase.public_id}/`,
        )
        .set('Authorization', `Bearer ${adminToken}`)
        .send('invalid data')
        .expect(HttpStatus.BAD_REQUEST),
    ]);
  });

  afterAll(async () => {
    await app.close();
  });
});
