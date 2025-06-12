import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { tokensReturns } from '../../mocks/data/user.data';
import {
  productSingleData,
  productSubscriptionData,
} from '../../mocks/data/product.data';

describe('ProductsController Delete (e2e)', () => {
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

  it('Should return 204 delete product', async () => {
    const adminToken = tokensReturns.tokensAdmin.access_token;
    const productSingleId = productSingleData.product.public_id;
    const productSubsId = productSubscriptionData.product.public_id;

    await request(app.getHttpServer())
      .delete(`/products/delete/${types[0]}/${productSingleId}/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .delete(`/products/delete/${types[1]}/${productSubsId}/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HttpStatus.NO_CONTENT);
  });

  it('Should return 401 when user is not athorized to perfom delete operation', async () => {
    const notPerformerToken = tokensReturns.tokensUser.access_token;
    const productSingleId = productSingleData.product.public_id;
    const productSubsId = productSubscriptionData.product.public_id;

    await request(app.getHttpServer())
      .delete(`/products/delete/${types[0]}/${productSingleId}/`)
      .set('Authorization', `Bearer ${notPerformerToken}`)
      .expect(HttpStatus.UNAUTHORIZED);

    await request(app.getHttpServer())
      .delete(`/products/delete/${types[0]}/${productSubsId}/`)
      .set('Authorization', `Bearer ${notPerformerToken}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('Should return 400 when type is invalid', async () => {
    const adminToken = tokensReturns.tokensAdmin.access_token;
    const productSingleId = productSingleData.product.public_id;

    await request(app.getHttpServer())
      .delete(`/products/delete/invalid-type/${productSingleId}/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('Should return 404 when product not found', async () => {
    const adminToken = tokensReturns.tokensAdmin.access_token;
    const productSingleId = productSingleData.product.public_id;
    const productSubsId = productSubscriptionData.product.public_id;

    await request(app.getHttpServer())
      .delete(`/products/delete/${types[0]}/${productSingleId}/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HttpStatus.NOT_FOUND);

    await request(app.getHttpServer())
      .delete(`/products/delete/${types[1]}/${productSubsId}/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    await app.close();
  });
});
