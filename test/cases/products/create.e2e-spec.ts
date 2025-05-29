import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { testData } from '../../mocks/data/test.data';

describe('ProductsController Create (e2e)', () => {
  let app: INestApplication;

  const imageMockURl =
    'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTEVcrypslvdUeHleSabemh-hXNLNslN-H0XVxm7ObA2J28dKoXFD5zck7QPMjyHGBCWXhq2nmA4YA0IYslGIM';

  const VALID_PRODUCT_DATA: CreateProductDto = {
    name: 'product name',
    description: 'the best product',
    price: 12345,
    slug: 'slug_product1',
    price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
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

  it('Should return 201 created product', async () => {
    const adminToken = testData.tokensReturnsAdmin.access_token;
    const testDataSingle = testData.productSinglePurchase;
    const testDataSubs = testData.productSubscriptionPurchase;

    const [responseSingle, responseSubs] = await Promise.all([
      request(app.getHttpServer())
        .post(`/products/create/${types[0]}/`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(VALID_PRODUCT_DATA)
        .expect(HttpStatus.CREATED),

      request(app.getHttpServer())
        .post(`/products/create/${types[1]}/`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(VALID_PRODUCT_DATA)
        .expect(HttpStatus.CREATED),
    ]);

    expect(responseSingle.body).not.toHaveProperty('id');
    expect(responseSingle.body).toHaveProperty('public_id');
    expect(responseSingle.body).toHaveProperty('created_at');
    expect(responseSingle.body).toHaveProperty('updated_at');
    expect(responseSingle.body).toHaveProperty('name', VALID_PRODUCT_DATA.name);
    expect(responseSingle.body).toHaveProperty(
      'description',
      VALID_PRODUCT_DATA.description,
    );
    expect(responseSingle.body).toHaveProperty(
      'price',
      VALID_PRODUCT_DATA.price,
    );
    expect(responseSingle.body).toHaveProperty(
      'image',
      VALID_PRODUCT_DATA.image,
    );
    expect(responseSingle.body).toHaveProperty('slug', VALID_PRODUCT_DATA.slug);

    testDataSingle.public_id = responseSingle.body.public_id;
    testDataSingle.name = responseSingle.body.name;
    testDataSingle.description = responseSingle.body.description;
    testDataSingle.price = responseSingle.body.price;
    testDataSingle.image = responseSingle.body.image;
    testDataSingle.slug = responseSingle.body.slug;
    testDataSingle.price_id = responseSingle.body.price_id;
    testDataSingle.created_at = responseSingle.body.created_at;
    testDataSingle.updated_at = responseSingle.body.updated_at;

    expect(responseSubs.body).not.toHaveProperty('id');
    expect(responseSubs.body).toHaveProperty('public_id');
    expect(responseSubs.body).toHaveProperty('created_at');
    expect(responseSubs.body).toHaveProperty('updated_at');
    expect(responseSubs.body).toHaveProperty('name', VALID_PRODUCT_DATA.name);
    expect(responseSubs.body).toHaveProperty(
      'description',
      VALID_PRODUCT_DATA.description,
    );
    expect(responseSubs.body).toHaveProperty('price', VALID_PRODUCT_DATA.price);
    expect(responseSubs.body).toHaveProperty('image', VALID_PRODUCT_DATA.image);
    expect(responseSubs.body).toHaveProperty('slug', VALID_PRODUCT_DATA.slug);

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

  it('Should return 409 when there is already a product with the same slug', async () => {
    const adminToken = testData.tokensReturnsAdmin.access_token;

    const responses = await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .post(`/products/create/${type}/`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(VALID_PRODUCT_DATA)
          .expect(HttpStatus.CONFLICT),
      ),
    );

    responses.map((response) => {
      expect(response.body).toHaveProperty('statusCode', HttpStatus.CONFLICT);
      expect(response.body).toHaveProperty(
        'message',
        'Product whith this slug already exists',
      );
    });
  });

  it('Should return 401 when user is not athorized to perfom create operation', async () => {
    const notPerformerToken = testData.tokensReturnsUser.access_token;

    const responses = await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .post(`/products/create/${type}/`)
          .set('Authorization', `Bearer ${notPerformerToken}`)
          .send(VALID_PRODUCT_DATA)
          .expect(HttpStatus.UNAUTHORIZED),
      ),
    );

    responses.map((response) => {
      expect(response.body).toHaveProperty(
        'statusCode',
        HttpStatus.UNAUTHORIZED,
      );
      expect(response.body).toHaveProperty('message');
    });
  });

  it('Should return 400 when type is invalid', async () => {
    const adminToken = testData.tokensReturnsAdmin.access_token;
    const invalidType = 'invalid-type';

    await request(app.getHttpServer())
      .post(`/products/create/${invalidType}/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(VALID_PRODUCT_DATA)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should validate required fields and return 400 for invalid data', async () => {
    const adminToken = testData.tokensReturnsAdmin.access_token;
    const invalidData = 'invalid-data';

    const responses = await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .post(`/products/create/${type}/`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidData)
          .expect(HttpStatus.BAD_REQUEST),
      ),
    );

    responses.map((response) => {
      expect(response.body).toHaveProperty(
        'statusCode',
        HttpStatus.BAD_REQUEST,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
