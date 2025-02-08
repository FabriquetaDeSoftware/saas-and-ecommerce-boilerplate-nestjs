import { ModulesContainer, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ForbiddenException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { serverConstants } from './shared/constants/server.constant';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 1048576,
      connectionTimeout: 15000,
    }),
    {
      rawBody: true,
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const host = serverConstants.host;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || host.includes(origin)) {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Not allowed by CORS'));
      }
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Api To Auth Boilerplate')
    .setDescription('API for testing saas and e-comerce boilerplate routes')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('email')
    .addTag('billing')
    .addTag('products')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const port = parseInt(serverConstants.port_api);

  await app.listen({ port, host: '0.0.0.0' });
}
bootstrap();
