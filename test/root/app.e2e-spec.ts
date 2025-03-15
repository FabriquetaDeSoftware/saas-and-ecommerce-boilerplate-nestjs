import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { JwtService } from '@nestjs/jwt';
import { RolesEnum } from 'src/shared/enum/roles.enum';

describe('Protected Routes (e2e)', () => {
  let app: INestApplication;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let mockAccessToken: string;

  beforeAll(async () => {
    const mockPayload = {
      email: 'test@gmail.com',
      role: RolesEnum.USER,
      sub: '1',
    };

    mockAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrVUZWdVA5eWNnLzEwcGJqN0lpR0JLaUt4ZS9pRWdGWmNlOVMrSXdFVkZ1czdhTDNPdG13NFI0Mm5LWXlrNUVOU0pCWFhBPT0iLCJlbWFpbCI6Im9qaDdTNENkS3dFdlE3ZVpReDN4ZHF3alFvclVGQlBsaEl2eHVDTG5udz09Iiwicm9sZSI6IjJQRHhQRjJVVG9GVHVzOFFYYVlKUmlwUG9RQzIiLCJ0eXBlIjoiTHJDRTNjaVNzYUNNZkJlVmFaZ3NQUXlENEJFRWZJK1dYdTltc2c9PSIsImlhdCI6MTc0MjA1ODEwOSwiZXhwIjoxNzQyMDU5OTA5fQ._Ho1-Afe4Q4ZKgaTHCbIKKwcecTHN0kiGOjQvg7tWiM';

    jwtServiceMock = {
      sign: jest.fn().mockReturnValue(mockAccessToken),
      verify: jest.fn().mockReturnValue(mockPayload),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /hello', () => {
    it('Should return message for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/hello/')
        .set('Authorization', `Bearer ${mockAccessToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('message');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
