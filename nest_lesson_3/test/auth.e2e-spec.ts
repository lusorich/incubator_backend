import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testInitSettings } from 'src/common/test-init-settings';
import { faker } from '@faker-js/faker';
import { createUserAndLogin } from './helpers/auth.helpers';

describe('Auth tests', () => {
  let app: INestApplication;
  let httpServer;
  let user;

  beforeAll(async () => {
    const result = await testInitSettings();

    app = result.app;
    httpServer = result.httpServer;

    const res = await createUserAndLogin(httpServer);

    user = res.user;
  });

  afterAll(async () => {
    await app.close();
  });

  test('Valid and non-exist User should return 200', () => {
    const newUser = {
      login: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    return request(httpServer)
      .post('/auth/registration')
      .send(newUser)
      .expect(HttpStatus.NO_CONTENT);
  });

  test('After registration user should exist in /users', async () => {
    const response = await request(httpServer)
      .get('/users')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' });

    const users = response.body.items;

    const found = users.find((item) => item.login === user.login);

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
