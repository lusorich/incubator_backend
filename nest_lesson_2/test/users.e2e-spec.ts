import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testInitSettings } from 'src/common/test-init-settings';
import { faker } from '@faker-js/faker';

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
      .send({
        login: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
      })
      .expect(HttpStatus.CREATED);
  });

  test('should return correct response body', async () => {
    const login = faker.person.firstName();
    const email = faker.internet.email();
    const password = faker.internet.password({ length: 8 });

    const response = await request(httpServer).post('/users').send({
      login,
      email,
      password,
    });

    expect(response.body).toMatchObject({ login, email });
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
  });

  test('should failed if login empty', () => {
    return request(httpServer)
      .post('/users')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password({ length: 8 }),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('should failed if email empty', () => {
    return request(httpServer)
      .post('/users')
      .send({
        login: faker.person.firstName(),
        password: faker.internet.password({ length: 8 }),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('should failed if password empty', () => {
    return request(httpServer)
      .post('/users')
      .send({
        login: faker.person.firstName(),
        email: faker.internet.email(),
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
