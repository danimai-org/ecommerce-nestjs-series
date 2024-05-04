import { NestFactory } from '@nestjs/core';
import { UserAppModule } from './modules/user/app.module';
import { ConfigService } from '@nestjs/config';
import { createApplication, documentationBuilder } from './utils/bootstrap';

async function bootstrap() {
  // User Module Setup
  const userApp = await NestFactory.create(UserAppModule);
  userApp.setGlobalPrefix('/user');
  createApplication(userApp);
  const userConfigService = userApp.get(ConfigService);
  documentationBuilder(userApp, userConfigService);
  await userApp.listen(userConfigService.get('app.port') || 8000);

  // Admin Module Setup
  const adminApp = await NestFactory.create(UserAppModule);
  adminApp.setGlobalPrefix('/admin');
  createApplication(adminApp);
  const adminConfigService = adminApp.get(ConfigService);
  documentationBuilder(adminApp, adminConfigService);

  await adminApp.listen(adminConfigService.get('app.adminPort') || 8001);
}
bootstrap();
