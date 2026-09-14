import { faker } from '@faker-js/faker';
import * as request from 'supertest';

export const createUserAndLogin = async (httpServer) => {
  const newUser = {
    login: faker.string.alpha({ length: { min: 3, max: 10 } }),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
  };

  await request(httpServer)
    .post('/users')
    .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
    .send(newUser);

  const response = await request(httpServer)
    .post('/auth/login')
    .send({ loginOrEmail: newUser.login, password: newUser.password });

  return { accessToken: response.body.accessToken, user: newUser };
};
