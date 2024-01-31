import supertest from "supertest";
import { ENDPOINTS } from "../src/constants";
import { app } from "../src/settings";
import { generateRandomVideo } from "../src/db";

const req = supertest(app);

describe("Testing video endpoints", () => {
  it("Testing get all videos", async () => {
    const res = await req.get(ENDPOINTS.VIDEOS);

    expect(res.statusCode).toBe(200);
  });

  it("Testing add new video", async () => {
    const video = generateRandomVideo();

    const res = await req.post(ENDPOINTS.VIDEOS).send(video);

    expect(res.body).toStrictEqual(video);
  });
});
