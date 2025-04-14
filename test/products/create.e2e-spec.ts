import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ISubscriptionProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';
import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { Products } from 'src/modules/products/domain/entities/products.entity';
import { GenerateTokenHelper } from 'src/modules/auth/shared/helpers/generate_token.helper';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenDto } from 'src/modules/auth/application/dto/generate_token.dto';
import { RolesEnum } from 'src/shared/enum/roles.enum';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let productSubscriptionRepositoryMock: jest.Mocked<ISubscriptionProductsRepository>;
  let productSingleRepositoryMock: jest.Mocked<ISingleProductsRepository>;
  let jwtService: JwtService;
  let cryptoUtil: ICryptoUtil;
  let generateTokenHelper: GenerateTokenHelper;

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

  const TEST_USER = {
    email: 'test@example.com',
    id: '123',
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
      role,
    };
    const tokens = await generateTokenHelper.execute(tokenDto);
    return tokens.access_token;
  };

  const types = ['single', 'subscription'];
  const mockProductResponse = (
    productData: CreateProductDto,
  ): Partial<Products> => ({
    public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
    name: productData.name,
    description: productData.description,
    price: productData.price,
    slug: productData.slug,
    price_id: productData.price_id,
    image: productData.image,
    created_at: new Date(),
    updated_at: new Date(),
  });

  beforeAll(async () => {
    productSingleRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest
        .fn()
        .mockImplementation(
          (dto: CreateProductDto): Promise<Partial<Products>> => {
            return Promise.resolve(mockProductResponse(dto));
          },
        ),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(undefined),
      listMany: jest.fn().mockImplementation(undefined),
    };

    productSubscriptionRepositoryMock = {
      findOneBySlug: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest
        .fn()
        .mockImplementation(
          (dto: CreateProductDto): Promise<Partial<Products>> => {
            return Promise.resolve(mockProductResponse(dto));
          },
        ),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(undefined),
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

  it('Should return 201 created product', async () => {
    const adminToken = await generateAuthToken(ROLES.VALID);

    const responses = await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .post(`/products/create/${type}/`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(VALID_PRODUCT_DATA)
          .expect(HttpStatus.CREATED),
      ),
    );

    responses.map((response) => {
      expect(response.body).not.toHaveProperty('id');
      expect(response.body).toEqual(
        expect.objectContaining({
          public_id: '9f3b779d-1ffc-4812-ab14-4e3687741538',
          name: VALID_PRODUCT_DATA.name,
          description: VALID_PRODUCT_DATA.description,
          price: VALID_PRODUCT_DATA.price,
          image: VALID_PRODUCT_DATA.image,
          slug: VALID_PRODUCT_DATA.slug,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      );
    });

    expect(productSingleRepositoryMock.create).toHaveBeenCalledWith(
      VALID_PRODUCT_DATA,
      { id: true },
    );

    expect(productSubscriptionRepositoryMock.create).toHaveBeenCalledWith(
      VALID_PRODUCT_DATA,
      { id: true },
    );
  });

  it('Should return 403 when user have a invalid ROlE', async () => {
    const invalidToken = await generateAuthToken(ROLES.INVALID);

    const responses = await Promise.all(
      types.map((type) =>
        request(app.getHttpServer())
          .post(`/products/create/${type}/`)
          .set('Authorization', `Bearer ${invalidToken}`)
          .send(VALID_PRODUCT_DATA)
          .expect(HttpStatus.FORBIDDEN),
      ),
    );

    responses.map((response) => {
      expect(response.body).toHaveProperty('statusCode', HttpStatus.FORBIDDEN);
      expect(response.body).toHaveProperty('message', 'Forbidden resource');

      expect(productSingleRepositoryMock.create).not.toHaveBeenCalledWith(
        VALID_PRODUCT_DATA,
        { id: true },
      );
    });
  });

  it('Should return 409 when there is already a product with the same slug', async () => {
    productSingleRepositoryMock.findOneBySlug.mockResolvedValueOnce(
      mockProductResponse(VALID_PRODUCT_DATA),
    );
    productSubscriptionRepositoryMock.findOneBySlug.mockResolvedValueOnce(
      mockProductResponse(VALID_PRODUCT_DATA),
    );

    const adminToken = await generateAuthToken(ROLES.VALID);

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

    expect(productSingleRepositoryMock.findOneBySlug).toHaveBeenCalledWith(
      VALID_PRODUCT_DATA.slug,
      { id: true },
    );
    expect(
      productSubscriptionRepositoryMock.findOneBySlug,
    ).toHaveBeenCalledWith(VALID_PRODUCT_DATA.slug, { id: true });

    expect(productSingleRepositoryMock.create).not.toHaveBeenCalledWith(
      VALID_PRODUCT_DATA,
      { id: true },
    );
    expect(productSubscriptionRepositoryMock.create).not.toHaveBeenCalledWith(
      VALID_PRODUCT_DATA,
      { id: true },
    );
  });

  it('Should return 401 when user is not athorized to perfom create operation', async () => {
    const notPerformerToken = await generateAuthToken(ROLES.NOTPERFORMER);

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

    expect(productSingleRepositoryMock.create).not.toHaveBeenCalled();
    expect(productSubscriptionRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('Should return 400 when type is invalid', async () => {
    const invalidType = 'invalid-type';

    await request(app.getHttpServer())
      .get(`/products/create/${invalidType}/`)
      .expect(HttpStatus.NOT_FOUND);

    expect(productSingleRepositoryMock.findOneBySlug).not.toHaveBeenCalled();
    expect(
      productSubscriptionRepositoryMock.findOneBySlug,
    ).not.toHaveBeenCalled();
    expect(productSingleRepositoryMock.create).not.toHaveBeenCalled();
    expect(productSubscriptionRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should validate required fields and return 400 for invalid data', async () => {
    const adminToken = await generateAuthToken(ROLES.VALID);

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

    expect(productSingleRepositoryMock.create).not.toHaveBeenCalled();
    expect(productSubscriptionRepositoryMock.create).not.toHaveBeenCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
