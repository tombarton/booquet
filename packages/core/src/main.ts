import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { CORS_CONFIG } from '@core/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // // CORS
  app.enableCors(CORS_CONFIG);

  // Enable cookie parser
  app.use(cookieParser());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
