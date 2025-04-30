import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { Products } from 'src/modules/products/domain/entities/products.entity';
import { ISubscriptionProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { GenerateTokenHelper } from 'src/modules/auth/shared/helpers/generate_token.helper';
import { GenerateTokenDto } from 'src/modules/auth/application/dto/generate_token.dto';
import { UpdateProductInfoDto } from 'src/modules/products/application/dto/update_product_info.dto';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let productSubscriptionRepositoryMock: jest.Mocked<ISubscriptionProductsRepository>;
  let productSingleRepositoryMock: jest.Mocked<ISingleProductsRepository>;
  let jwtService: JwtService;
  let cryptoUtil: ICryptoUtil;
  let generateTokenHelper: GenerateTokenHelper;

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

  const TEST_USER = {
    email: 'test@example.com',
    id: '123',
    name: 'Test User',
  };

  const ROLES = {
    VALID: RolesEnum.ADMIN,
    NOTPERFORMER: RolesEnum.USER,
    INVALID: 'INVALID_ROLE',
  };

  const generateAuthToken = async (
    role: RolesEnum | string,
  ): Promise<string> => {
    const tokenDto: GenerateTokenDto = {
      email: TEST_USER.email,
      sub: TEST_USER.id,
      name: TEST_USER.name,
      role,
    };
    const tokens = await generateTokenHelper.execute(tokenDto);
    return tokens.access_token;
  };

  const validPublicId = '9f3b779d-1ffc-4812-ab14-4e3687741538';
  const types = ['single', 'subscription'];
  const mockProductResponse: Products = {
    id: 1,
    public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
    name: 'Product 1',
    description: 'Product 1 description',
    price: 10000,
    price_id: 'price_1N4v2cK0x5g3e7d8f8e8e8e8',
    slug: 'product-1',
    image: [imageMockURl, imageMockURl],
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeAll(async () => {
    productSingleRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(mockProductResponse),
      listMany: jest.fn().mockImplementation(undefined),
    };

    productSubscriptionRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(mockProductResponse),
      listMany: jest.fn().mockImplementation(undefined),
    };

    const cryptoUtilMock = {
      encryptData: jest
        .fn()
        .mockImplementation((data: string) =>
          Promise.resolve(Buffer.from(data)),
        ),
      decryptData: jest
        .fn()
        .mockImplementation((data: Buffer) => Promise.resolve(data.toString())),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('ICryptoUtil')
      .useValue(cryptoUtilMock)
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

    jwtService = moduleFixture.get<JwtService>(JwtService);
    cryptoUtil = moduleFixture.get<ICryptoUtil>('ICryptoUtil');

    generateTokenHelper = new GenerateTokenHelper();
    Object.defineProperty(generateTokenHelper, '_jwtService', {
      value: jwtService,
      writable: true,
    });
    Object.defineProperty(generateTokenHelper, '_cryptoUtil', {
      value: cryptoUtil,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return updated product', async () => {
    expect(productSingleRepositoryMock.findOneByPublicId);

    const adminToken = await generateAuthToken(ROLES.VALID);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .patch(`/products/update/${type}/${validPublicId}/`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(VALID_PRODUCT_DATA)
          .expect(HttpStatus.OK),
      ),
    );

    expect(productSubscriptionRepositoryMock.update).toHaveBeenCalledWith(
      validPublicId,
      { ...VALID_PRODUCT_DATA },
      { id: true },
    );

    expect(productSingleRepositoryMock.update).toHaveBeenCalledWith(
      validPublicId,
      { ...VALID_PRODUCT_DATA },
      { id: true },
    );
  });

  it('Should return 403 when user is not ADMIN', async () => {
    const invalidRoleToken = await generateAuthToken(ROLES.INVALID);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .patch(`/products/update/${type}/${validPublicId}/`)
          .set('Authorization', `Bearer ${invalidRoleToken}`)
          .send(VALID_PRODUCT_DATA)
          .expect(HttpStatus.FORBIDDEN),
      ),
    );

    expect(productSubscriptionRepositoryMock.update).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.update).not.toHaveBeenCalled;
  });

  it('Should return 401 when user is not athorized to perfom update operation', async () => {
    const notPerformerToken = await generateAuthToken(ROLES.NOTPERFORMER);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .patch(`/products/update/${type}/${validPublicId}/`)
          .set('Authorization', `Bearer ${notPerformerToken}`)
          .send(VALID_PRODUCT_DATA)
          .expect(HttpStatus.UNAUTHORIZED),
      ),
    );

    expect(productSubscriptionRepositoryMock.update).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('Should return 404 when product not found', async () => {
    productSingleRepositoryMock.findOneByPublicId.mockResolvedValue(null);
    productSubscriptionRepositoryMock.findOneByPublicId.mockResolvedValue(null);

    const adminToken = await generateAuthToken(ROLES.VALID);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .delete(`/products/update/${type}/${validPublicId}/`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(VALID_PRODUCT_DATA)
          .expect(HttpStatus.NOT_FOUND),
      ),
    );

    expect(productSubscriptionRepositoryMock.update).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('Should return 400 when type is invalid', async () => {
    const adminToken = await generateAuthToken(ROLES.VALID);

    await request(app.getHttpServer())
      .patch(`/products/update/invalid-type/${validPublicId}/`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(VALID_PRODUCT_DATA)
      .expect(HttpStatus.BAD_REQUEST);

    expect(productSubscriptionRepositoryMock.update).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should validate required fields and return 400 for invalid data', async () => {
    const adminToken = await generateAuthToken(ROLES.VALID);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .patch(`/products/update/${type}/${validPublicId}/`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send('invalid data')
          .expect(HttpStatus.BAD_REQUEST),
      ),
    );

    expect(productSubscriptionRepositoryMock.update).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.update).not.toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
