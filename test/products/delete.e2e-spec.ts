import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';
import { ISubscriptionProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { GenerateTokenHelper } from 'src/modules/auth/shared/helpers/generate_token.helper';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { Products } from 'src/modules/products/domain/entities/products.entity';
import { GenerateTokenDto } from 'src/modules/auth/application/dto/generate_token.dto';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let productSubscriptionRepositoryMock: jest.Mocked<ISubscriptionProductsRepository>;
  let productSingleRepositoryMock: jest.Mocked<ISingleProductsRepository>;
  let jwtService: JwtService;
  let cryptoUtil: ICryptoUtil;
  let generateTokenHelper: GenerateTokenHelper;

  const imageMockURl =
    'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTEVcrypslvdUeHleSabemh-hXNLNslN-H0XVxm7ObA2J28dKoXFD5zck7QPMjyHGBCWXhq2nmA4YA0IYslGIM';

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
    price: 100,
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

  it('Should return 204 delete product', async () => {
    const adminToken = await generateAuthToken(ROLES.VALID);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .delete(`/products/delete/${type}/${validPublicId}/`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(HttpStatus.NO_CONTENT),
      ),
    );

    expect(productSubscriptionRepositoryMock.delete).toHaveBeenCalledWith(
      validPublicId,
    );
    expect(productSingleRepositoryMock.delete).toHaveBeenCalledWith(
      validPublicId,
    );
  });

  it('Should return 403 when user have a invalid ROlE', async () => {
    const invalidToken = await generateAuthToken(ROLES.INVALID);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .delete(`/products/delete/${type}/${validPublicId}/`)
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(HttpStatus.FORBIDDEN),
      ),
    );

    expect(productSubscriptionRepositoryMock.delete).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('Should return 401 when user is not athorized to perfom delete operation', async () => {
    const notPerformerToken = await generateAuthToken(ROLES.NOTPERFORMER);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .delete(`/products/delete/${type}/${validPublicId}/`)
          .set('Authorization', `Bearer ${notPerformerToken}`)
          .expect(HttpStatus.UNAUTHORIZED),
      ),
    );

    expect(productSubscriptionRepositoryMock.delete).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('Should return 404 when product not found', async () => {
    productSingleRepositoryMock.findOneByPublicId.mockResolvedValue(null);
    productSubscriptionRepositoryMock.findOneByPublicId.mockResolvedValue(null);

    const validToken = await generateAuthToken(ROLES.VALID);

    await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .delete(`/products/delete/${type}/${validPublicId}/`)
          .set('Authorization', `Bearer ${validToken}`)
          .expect(HttpStatus.NOT_FOUND),
      ),
    );

    expect(
      productSubscriptionRepositoryMock.findOneByPublicId,
    ).toHaveBeenCalled();
    expect(productSingleRepositoryMock.findOneByPublicId).toHaveBeenCalled();

    expect(productSubscriptionRepositoryMock.delete).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('Should return 400 when type is invalid', async () => {
    const validToken = await generateAuthToken(ROLES.VALID);

    await request(app.getHttpServer())
      .delete(`/products/delete/invalid-type/${validPublicId}/`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(HttpStatus.BAD_REQUEST);

    expect(productSubscriptionRepositoryMock.delete).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.delete).not.toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
