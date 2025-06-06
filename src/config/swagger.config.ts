import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RawServerDefault } from 'fastify';

export function swaggerConfig(
  app: NestFastifyApplication<RawServerDefault>,
): void {
  const config = new DocumentBuilder()
    .setTitle('Api to SaaS and E-commerce Boilerplate')
    .setDescription('API for testing saas and e-commerce boilerplate routes')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('email')
    .addTag('billing')
    .addTag('products')
    .addTag('app')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}
