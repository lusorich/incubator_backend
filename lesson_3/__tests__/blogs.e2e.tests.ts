import supertest from "supertest";
import { ENDPOINTS } from "../src/constants";
import { app } from "../src/app";
import { BlogsRepository } from "../src/repositories/blogs.repository";
import { db } from "../src/db/db";

const req = supertest(app);

let blogsRepository = new BlogsRepository(db);

beforeAll(() => {
  blogsRepository = new BlogsRepository(db);
});

describe("Testing blogs", () => {
  it("[GET] should return [] if blogs is empty", async () => {
    const res = await req.get(ENDPOINTS.BLOGS);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([]);
  });

  it("[GET] should return array with all blogs, if blogs not empty", async () => {
    const blog = {
      name: "test",
      description: "test",
      websiteUrl: "https://test.com",
    };

    blogsRepository.addBlog(blog);
    blogsRepository.addBlog(blog);

    const res = await req.get(ENDPOINTS.BLOGS);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});
