import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testInitSettings } from 'src/common/test-init-settings';
import { faker } from '@faker-js/faker';
import { createUserAndLogin } from './helpers/auth.helpers';

describe('Auth tests', () => {
  let app: INestApplication;
  let httpServer;
  let user;
  let accessToken;

  beforeAll(async () => {
    const result = await testInitSettings();
    const res = await createUserAndLogin(httpServer);

    app = result.app;
    httpServer = result.httpServer;

    accessToken = res.accessToken;
    user = res.user;
  });

  afterAll(async () => {
    await app.close();
  });

  test('Valid and non-exist User should return 200', () => {
    return request(httpServer)
      .post('/auth/registration')
      .send(user)
      .expect(HttpStatus.NO_CONTENT);
  });

  test('After registration user should exist in /users', async () => {
    const response = await request(httpServer).get('/users');
    const users = response.body.items;

    const found = users.find((user) => user.login === user.login);

    expect(found).toBeDefined();
  });

  test('If email exist should return 400', () => {
    return request(httpServer)
      .post('/auth/registration')
      .send({
        login: faker.person.firstName(),
        email: user.email,
        password: user.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('If login exist should return 400', () => {
    return request(httpServer)
      .post('/auth/registration')
      .send({
        login: user.login,
        email: faker.internet.email(),
        password: user.password,
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
