import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testInitSettings } from 'src/common/test-init-settings';
import { faker } from '@faker-js/faker';

describe('Auth tests', () => {
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

  test('', () => {
    return request(httpServer)
      .post('/users')
      .send({
        login: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
      })
      .expect(HttpStatus.CREATED);
  });
});
