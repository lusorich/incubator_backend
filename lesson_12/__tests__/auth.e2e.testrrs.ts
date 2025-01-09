// import supertest from "supertest";
// import { ENDPOINTS, HTTP_STATUS } from "../src/constants";
// import { app, server } from "../src/app";

// import { usersService } from "../src/domain/services/users.service";

// const req = supertest(app);

// // beforeEach(async () => {
// //   await usersService.clearUsers();
// // });

// afterAll(() => {
//   server.close();
// });

// const USER_MOCK = {
//   loginOrEmail: "aaaa@mail.ru",
//   password: "fsdfdFF",
// };

// const ACCESS_TOKEN_MOCK =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZWExMDU3ZjNkZjkwNjZmMTdkNzE4MyIsImlhdCI6MTcxMDA5MTMzMiwiZXhwIjoxNzEwMDk0OTMyfQ.8nnRieJPB_DQSgjUe02bpKmqRQLAndAOIUsG8Lbl3Ts";
// describe("Testing [POST] method", () => {
//   test("Should return acessToken if user exist", async () => {
//     const res = await req.post(ENDPOINTS.AUTH_LOGIN).send(USER_MOCK);

//     expect(res.statusCode).toBe(HTTP_STATUS.SUCCESS);
//     expect(res.body.accessToken).not.toBeNull();
//   });

//   test("Shold return 400 if not correct loginOrEmail field", async () => {
//     const res = await req
//       .post(ENDPOINTS.AUTH_LOGIN)
//       .send({ loginOrEmail: "a" });

//     expect(res.statusCode).toBe(HTTP_STATUS.INCORRECT);
//   });

//   test("Shold return 401 if login or password not correct", async () => {
//     const res = await req.post(ENDPOINTS.AUTH_LOGIN).send({
//       loginOrEmail: "nononon@gggg.com",
//       password: "hFFhfdsfTTlkfds11",
//     });

//     expect(res.statusCode).toBe(HTTP_STATUS.NO_AUTH);
//   });
// });

// describe("Testing [GET] method", () => {
//   test("Should return 401 if token not provided", async () => {
//     const res = await req.get(ENDPOINTS.AUTH_ME);

//     expect(res.statusCode).toBe(HTTP_STATUS.NO_AUTH);
//   });
//   test("Should return user info if token correct", async () => {
//     await req.post(ENDPOINTS.AUTH_LOGIN).send(USER_MOCK);

//     const res = await req
//       .get(ENDPOINTS.AUTH_ME)
//       .set("Authorization", "Bearer" + " " + ACCESS_TOKEN_MOCK);

//     expect(res.statusCode).toBe(HTTP_STATUS.SUCCESS);
//     expect(res.body).toHaveProperty("email");
//     expect(res.body).toHaveProperty("login");
//     expect(res.body).toHaveProperty("userId");
//   });
// });
