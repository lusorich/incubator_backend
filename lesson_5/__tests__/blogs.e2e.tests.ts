import supertest from "supertest";
import { ENDPOINTS } from "../src/constants";
import { app } from "../src/app";

import { blogsService } from "../src/domain/services/blogs.service";
import { addMockBlogs, generateFiltersOptions } from "./helpers";

const req = supertest(app);

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

    const res = await req.get(ENDPOINTS.BLOGS + generateFiltersOptions(20));

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(20);
  });

  test("If pageNumber provided should return blogs only in this page", async () => {
    await addMockBlogs(40);

    const res = await req.get(ENDPOINTS.BLOGS + generateFiltersOptions(10, 2));

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(10);
  });

  test("If searchNameTerm provided should return only blogs includes that term", async () => {
    await addMockBlogs(40);

    const res = await req.get(
      ENDPOINTS.BLOGS +
        generateFiltersOptions(10, 2, undefined, undefined, "aa")
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(0);
  });

  test("If sortBy provided shoud return blogs sorted by sortBy in desc order", async () => {
    await addMockBlogs(40, ["Aa"]);

    const res = await req.get(
      ENDPOINTS.BLOGS + generateFiltersOptions(40, 1, "name")
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.items[0]?.name).not.toEqual("Aa");
  });

  test("If sortBy provided and sortDirection shoud return blogs sorted by sortBy in provided sort order", async () => {
    await addMockBlogs(40, ["Aa"]);

    const res = await req.get(
      ENDPOINTS.BLOGS + generateFiltersOptions(40, 1, "name", "asc")
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.items[0]?.name).toEqual("Aa");
  });
});
