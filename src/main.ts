import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // CORS
  app.enableCors({
    // @TODO: Sort this out for production (e.g. move to an environment variable)
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Enable cookie parser.
  app.use(cookieParser());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
