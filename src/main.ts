import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createApplication, documentationBuilder } from './utils/bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // bootstrapped functions
  createApplication(app);
  documentationBuilder(app, configService);

  await app.listen(configService.get('app.port') || 8000);
}
bootstrap();
