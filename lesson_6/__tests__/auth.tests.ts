import supertest from "supertest";
import { ENDPOINTS } from "../src/constants";
import { app } from "../src/app";

import { addMockBlogs, generateFiltersOptions } from "./helpers";
import { usersService } from "../src/domain/services/users.service";

const req = supertest(app);

beforeEach(async () => {
  await usersService.clearUsers();
});

describe("Testing [POST] method", () => {
  test("Should return acessToken", async () => {
    const res = await req.get(ENDPOINTS.BLOGS);

    expect(res.statusCode).toBe(200);
    expect(res.body.items).toStrictEqual([]);
  });
});
