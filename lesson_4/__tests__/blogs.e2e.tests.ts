import supertest from "supertest";
import { ENDPOINTS } from "../src/constants";
import { app } from "../src/app";
import { blogsService } from "../src/domain/blogs.service";
import { blogsQueryRepository } from "../src/repositories/blogs.query.repository";
import { BlogWithId } from "../src/types";

const req = supertest(app);

const MOCK_BLOG = {
  name: "test",
  description: "test",
  websiteUrl: "https://test.com",
};

beforeEach(async () => {
  await blogsService.clearBlogs();
});

describe("Testing GET method", () => {
  test("Should return [] if blogs is empty", async () => {
    const res = await req.get(ENDPOINTS.BLOGS);

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toStrictEqual([]);
  });

  test("Should return array with all blogs, if blogs not empty", async () => {
    await addMockBlogs(2);

    const res = await req.get(ENDPOINTS.BLOGS);

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(2);
  });

  test("If pageSize provided should return correct number of blogs", async () => {
    await addMockBlogs(20);

    const res = await req.get(ENDPOINTS.BLOGS + "?pageSize=20");

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(20);
  });

  test("If pageNumber provided should return blogs only in this page", async () => {
    await addMockBlogs(40);

    const res = await req.get(ENDPOINTS.BLOGS + "?pageSize=10&pageNumber=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(10);
  });
});

const addMockBlogs = async (count: number): Promise<(BlogWithId | null)[]> => {
  let blogs: (BlogWithId | null)[] = [];

  for (let i = 0; i < count; i++) {
    const blog = await blogsService.addBlog(MOCK_BLOG);
    //TODO: REWRITE
    //@ts-ignore
    blog!.createdAt = blog?.createdAt.toISOString() || new Date();

    blogs.push(blog);
  }

  return blogs;
};
