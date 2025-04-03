import supertest from "supertest";
import { app } from "../src/app";
import { ENDPOINTS, HTTP_STATUS } from "../src/constants";
import { faker } from "@faker-js/faker";
import { getMockRegistrationData } from "./helpers";

const req = supertest(app);

describe("Testing sessions", () => {
  test("When user success login, new session add", async () => {
    const user = getMockRegistrationData();

    await req.post(ENDPOINTS.REGISTRATION).send(user);
    const authRes = await req.post(ENDPOINTS.AUTH_LOGIN).send({
      loginOrEmail: user.email,
      password: user.password,
    });

    const res = await req
      .get(ENDPOINTS.SECURITY_DEVICES)
      .set("Cookie", [...authRes.headers["set-cookie"]]);

    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("When user login wrong, get sessions return 401 status", async () => {
    const authRes = await req.post(ENDPOINTS.AUTH_LOGIN).send({
      loginOrEmail: "",
      password: "",
    });

    const res = await req
      .get(ENDPOINTS.SECURITY_DEVICES)
      .set("Cookie", [...(authRes.headers?.["set-cookie"] ?? [])]);

    expect(res.statusCode).toBe(HTTP_STATUS.NO_AUTH);
  });
});
