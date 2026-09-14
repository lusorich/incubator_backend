import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testInitSettings } from 'src/common/test-init-settings';
import { faker } from '@faker-js/faker';

describe('Auth tests', () => {
  let app: INestApplication;
  let httpServer;
  let userMock;

  beforeAll(async () => {
    const result = await testInitSettings();

    app = result.app;
    httpServer = result.httpServer;

    userMock = {
      login: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
    };
  });

  afterAll(async () => {
    await app.close();
  });

  test('Valid and non-exist User should return 200', () => {
    return request(httpServer)
      .post('/auth/registration')
      .send(userMock)
      .expect(HttpStatus.NO_CONTENT);
  });

  test('After registration user should exist in /users', async () => {
    const response = await request(httpServer).get('/users');
    const users = response.body.items;

    const found = users.find((user) => user.login === userMock.login);

    expect(found).toBeDefined();
  });

  test('If email exist should return 400', () => {
    return request(httpServer)
      .post('/auth/registration')
      .send({
        login: faker.person.firstName(),
        email: userMock.email,
        password: userMock.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('If login exist should return 400', () => {
    return request(httpServer)
      .post('/auth/registration')
      .send({
        login: userMock.login,
        email: faker.internet.email(),
        password: userMock.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
