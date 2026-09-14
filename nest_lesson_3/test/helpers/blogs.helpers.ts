import { faker } from '@faker-js/faker';

export const getNewBlog = () => ({
  name: faker.string.alpha(10),
  description: faker.string.alpha(20),
  websiteUrl: faker.internet.email(),
});
