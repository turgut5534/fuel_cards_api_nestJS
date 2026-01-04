import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
dotenv.config(); // Load .env file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8081', // Your Expo web frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // If you send cookies or auth headers
  });

   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // strips properties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true,      // automatically transforms payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
