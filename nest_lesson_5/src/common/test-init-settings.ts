import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { applyAppSettings } from 'src/settings/applyAppSettings';

export const testInitSettings = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  applyAppSettings(app);

  await app.init();

  const httpServer = app.getHttpServer();

  return { app, httpServer };
};
