import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Enable CORS (important for frontend connection)
  app.enableCors();

  //  Global Validation Pipe (VERY IMPORTANT)
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,   
      transform: true,              
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('LMS API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
