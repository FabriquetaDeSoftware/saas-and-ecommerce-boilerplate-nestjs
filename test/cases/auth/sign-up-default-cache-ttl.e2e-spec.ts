import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { AppModule } from 'src/app.module';
import { SignUpDefaultDto } from 'src/modules/auth/application/dto/sign_up_default.dto';

// cache-manager v6 expects the TTL in milliseconds. The account verification
// code is meant to live for 5 hours, so it must still be cached well after the
// 18 seconds that a raw `18_000` would produce.
describe('AuthController SignUp Default cache TTL (e2e)', () => {
  let app: INestApplication;
  let cache: Cache;

  const USER_DATA: SignUpDefaultDto = {
    name: 'Cache Ttl User',
    email: 'signup-cache-ttl@example.com',
    password: 'Password123!',
    newsletter_subscription: true,
    terms_and_conditions_accepted: true,
  };

  const CACHE_KEY = `accountVerificationCode:${USER_DATA.email}`;

  // The test waits past the (wrong) 18 second TTL, so it needs a custom timeout.
  jest.setTimeout(60_000);

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

    cache = app.get<Cache>(CACHE_MANAGER);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the verification code cached for more than 18 seconds', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-up-default/')
      .send(USER_DATA)
      .expect(HttpStatus.CREATED);

    expect(await cache.get(CACHE_KEY)).toBeTruthy();

    await new Promise((resolve) => setTimeout(resolve, 19_000));

    expect(await cache.get(CACHE_KEY)).toBeTruthy();
  });

  afterAll(async () => {
    await cache.del(CACHE_KEY);
    await app.close();
  });
});
