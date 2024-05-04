import { NestFactory } from '@nestjs/core';
import { AdminModule } from './app.module';
import {
  createApplication,
  documentationBuilder,
} from 'common/utils/bootstrap';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Admin Module Setup
  const app = await NestFactory.create(AdminModule);
  createApplication(app);
  const adminConfigService = app.get(ConfigService);
  documentationBuilder(app, adminConfigService, 'Admin');

  await app.listen(adminConfigService.get('app.adminPort') || 8001);
}
bootstrap();
