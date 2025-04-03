import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testInitSettings } from 'src/common/test-init-settings';
import { createUserAndLogin } from './helpers/auth.helpers';

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

  describe('Auth user tests', () => {
    let user;

    beforeAll(async () => {
      const res = await createUserAndLogin(httpServer);

      user = res.user;
    });

    test('user should created', () => {
      return request(httpServer)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send(user)
        .expect(HttpStatus.CREATED);
    });

    test('should return correct response body', async () => {
      const response = await request(httpServer)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send(user);

      expect(response.body).toMatchObject({
        login: user.login,
        email: user.email,
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
    });

    test('should failed if login empty', () => {
      return request(httpServer)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    test('should failed if email empty', () => {
      return request(httpServer)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send({
          login: user.login,
          password: user.password,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    test('should failed if password empty', () => {
      return request(httpServer)
        .post('/users')
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .send({
          login: user.login,
          email: user.email,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
