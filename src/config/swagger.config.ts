import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { RawServerDefault } from 'fastify';
import { AuthModule } from 'src/modules/auth/auth.module';

export function swaggerConfig(
  app: NestFastifyApplication<RawServerDefault>,
): void {
  const config = new DocumentBuilder()
    .setTitle('Api to SaaS and E-commerce Boilerplate')
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
}
