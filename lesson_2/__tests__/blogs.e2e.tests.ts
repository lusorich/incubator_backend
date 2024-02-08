import supertest from "supertest";
import { ENDPOINTS } from "../src/constants";
import { app } from "../src/app";
import { LocalDB } from "../src/db/db";
import { BlogsRepository } from "../src/repositories/blogs.repository";

const req = supertest(app);

let blogsRepository = new BlogsRepository();

beforeAll(() => {
  blogsRepository = new BlogsRepository();
});

describe("Testing blogs", () => {
  it("[GET] get all should return all blogs", async () => {
    const res = await req.get(ENDPOINTS.BLOGS);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([]);
  });
});
