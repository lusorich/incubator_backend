import supertest from "supertest";
import { ENDPOINTS } from "../src/constants";
import { app } from "../src/settings";
import { LocalDB, generateRandomVideo } from "../src/db";

const req = supertest(app);

let db = new LocalDB();

afterEach(() => {
  db = new LocalDB();
});

describe("Testing videos endpoints", () => {
  it("Testing get with empty videos", async () => {
    const res = await req.get(ENDPOINTS.VIDEOS);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([]);
  });

  it("Testing get with 2 added video", async () => {
    const firstAddReq = await req
      .post(ENDPOINTS.VIDEOS)
      .send(db.addVideo(generateRandomVideo()));

    const secondAddReq = await req
      .post(ENDPOINTS.VIDEOS)
      .send(db.addVideo(generateRandomVideo()));

    const res = await req.get(ENDPOINTS.VIDEOS);

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([firstAddReq.body, secondAddReq.body]);
  });
});
