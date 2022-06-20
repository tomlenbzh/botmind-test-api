import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS_CONFIG } from './utils/constants/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CORS_CONFIG);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
