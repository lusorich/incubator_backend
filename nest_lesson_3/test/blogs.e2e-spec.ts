import { INestApplication } from '@nestjs/common';
import { testInitSettings } from 'src/common/test-init-settings';
import { createUserAndLogin } from './helpers/auth.helpers';
import * as request from 'supertest';

describe('Blogs test', () => {
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

  test('[GET /blogs] shoud return empty list, if havent added blog', async () => {
    const response = await request(httpServer)
      .get('/blogs')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send();

    expect(response.body.items).toHaveLength(0);
  });
});
