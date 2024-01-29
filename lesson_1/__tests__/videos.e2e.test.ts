import supertest from "supertest";
import { SETTINGS } from "../src/index";
import { app } from "../src/setting";

const req = supertest(app);

describe("Testing video endpoints", () => {
  it("Testing get endpoint", async () => {
    const res = await req.get(`${SETTINGS.VIDEOS_API_PATH}`);

    expect(res.statusCode).toBe(200);
  });
});
