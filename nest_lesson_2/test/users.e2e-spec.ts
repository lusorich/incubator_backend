import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testInitSettings } from 'src/common/test-init-settings';

describe('Users tests', () => {
  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const result = await testInitSettings();

    app = result.app;
    httpServer = result.httpServer;
  });

  afterAll(async () => {
    await app.close();
  });

  test('user should created', () => {
    return request(httpServer)
      .post('/users')
      .send({ login: 'fdsfds', email: 'fdsfds@mail.ru', password: 'fdfdRR' })
      .expect(HttpStatus.CREATED);
  });
});
