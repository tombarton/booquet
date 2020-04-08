import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // CORS
  app.enableCors();

  // Enable cookie parser.
  app.use(cookieParser());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
