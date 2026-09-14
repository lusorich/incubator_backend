import { HttpStatus, INestApplication } from '@nestjs/common';
import { testInitSettings } from 'src/common/test-init-settings';
import { createUserAndLogin } from './helpers/auth.helpers';
import * as request from 'supertest';
import { getNewBlog } from './helpers/blogs.helpers';

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
    await request(httpServer).delete('/testing/all-data').send();

    await app.close();
  });

  test('[GET] should return empty list, if havent added blog', async () => {
    const response = await request(httpServer)
      .get('/blogs')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send();

    expect(response.body.items).toHaveLength(0);
  });

  test('[GET] should return non-empty list, if has added blog', async () => {
    const blog = getNewBlog();

    await request(httpServer).post('/blogs').send(blog);
    const response = await request(httpServer).get('/blogs').send();

    expect(response.body.items.length).toBeGreaterThanOrEqual(1);
  });

  test('[GET/:ID] shoud return blog by id, if id exists', async () => {
    const blog = getNewBlog();

    const addBlogResponse = await request(httpServer).post('/blogs').send(blog);
    const getBlogResponse = await request(httpServer)
      .get(`/blogs/${addBlogResponse.body.id}`)
      .send();

    expect(getBlogResponse.body).toMatchObject(blog);
  });

  test('[GET/ID] should return not found, if id doesnt exists', async () => {
    const response = await request(httpServer).get('/blogs/fdsfds').send();

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  test('[POST] should add new blog, if body valid', async () => {
    const blog = getNewBlog();

    const response = await request(httpServer).post('/blogs').send(blog);

    expect(response.body).toMatchObject(blog);
  });

  test('[POST] should return error, if body not valid', async () => {
    const response = await request(httpServer).post('/blogs').send({});

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  test('[PUT] should update blog with new fields', async () => {
    const blog = getNewBlog();
    const newFields = { name: 'Test' };

    const createBlogResponse = await request(httpServer)
      .post('/blogs')
      .send(blog);
    const updateBlogResponse = await request(httpServer)
      .put(`/blogs/${createBlogResponse.body.id}`)
      .send(newFields);

    expect(updateBlogResponse.statusCode).toBe(HttpStatus.NO_CONTENT);

    const getBlogReponse = await request(httpServer).get(
      `/blogs/${createBlogResponse.body.id}`,
    );

    expect(getBlogReponse.body.name).toBe(newFields.name);
  });
});
