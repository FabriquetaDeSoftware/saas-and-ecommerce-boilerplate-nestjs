import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { IProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';
import { ListManyProductsReturn } from 'src/modules/products/domain/types/list_many_products_return.type';
import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';

describe('AuthController from AppModule (e2e)', () => {
  let app: INestApplication;
  let productRepositoryMock: jest.Mocked<IProductsRepository>;

  beforeEach(async () => {
    if (app) {
      await app.close();
    }

    productRepositoryMock = {
      listMany: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockImplementation(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      findOneByPublicId: jest.fn().mockResolvedValue(undefined),
      listManyWithPagination: jest.fn().mockImplementation(
        (dto: ListManyProductsDto): Promise<ListManyProductsReturn> =>
          Promise.resolve({
            data: [
              {
                id: 1,
                public_id: '1',
                name: 'Product 1',
                description: 'Description 1',
                price: 10,
                image: 'image1.jpg',
                slug: 'product-1',
                created_at: new Date(),
                updated_at: new Date(),
              },
              {
                id: 2,
                public_id: '2',
                name: 'Product 2',
                description: 'Description 2',
                price: 10,
                image: 'image2.jpg',
                slug: 'product-1',
                created_at: new Date(),
                updated_at: new Date(),
              },
            ],
            page: 1,
            pageSize: 1,
            total: 2,
            totalPages: 2,
          }),
      ),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('IProductsRepository')
      .useValue(productRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();
  });

  it('Should return products[]', async () => {
    const listManyProductsData: ListManyProductsDto = {
      page: 1,
      pageSize: 1,
    };
    await request(app.getHttpServer())
      .get(
        `/products/list-many?page=${listManyProductsData.page}&pageSize=${listManyProductsData.pageSize}`,
      )
      .expect(200);

    expect(productRepositoryMock.listManyWithPagination).toHaveBeenCalledWith(
      undefined,
      listManyProductsData.page - 1,
      listManyProductsData.pageSize,
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
