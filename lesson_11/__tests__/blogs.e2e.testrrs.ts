// import supertest from "supertest";
// import { ENDPOINTS, HTTP_STATUS } from "../src/constants";
// import { app, server } from "../src/app";

// import { blogsService } from "../src/domain/services/blogs.service";
// import {
//   addMockBlogs,
//   generateFiltersOptions,
//   getMockBlogInput,
//   withAuthCredentials,
// } from "./helpers";

// const req = supertest(app);

// beforeEach(async () => {
//   await blogsService.clearBlogs();
// });

// afterAll(() => {
//   server.close();
// });

// describe("Testing blogs GET methods", () => {
//   test("Should return [] if blogs is empty", async () => {
//     const res = await req.get(ENDPOINTS.BLOGS);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.items).toStrictEqual([]);
//   });

//   test("Should return array with all blogs, if blogs not empty", async () => {
//     await addMockBlogs(2);

//     const res = await req.get(ENDPOINTS.BLOGS);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.items).toHaveLength(2);
//   });

//   test("If pageSize provided should return correct number of blogs", async () => {
//     await addMockBlogs(20);

//     const res = await req.get(ENDPOINTS.BLOGS + generateFiltersOptions(20));

//     expect(res.statusCode).toBe(200);
//     expect(res.body.items).toHaveLength(20);
//   });

//   test("If pageNumber provided should return blogs only in this page", async () => {
//     await addMockBlogs(40);

//     const res = await req.get(ENDPOINTS.BLOGS + generateFiltersOptions(10, 2));

//     expect(res.statusCode).toBe(200);
//     expect(res.body.items).toHaveLength(10);
//   });

//   test("If searchNameTerm provided should return only blogs includes that term", async () => {
//     await addMockBlogs(40);

//     const res = await req.get(
//       ENDPOINTS.BLOGS +
//         generateFiltersOptions(10, 2, undefined, undefined, "aa")
//     );

//     expect(res.statusCode).toBe(200);
//     expect(res.body.items).toHaveLength(0);
//   });

//   test("If sortBy provided shoud return blogs sorted by sortBy in desc order", async () => {
//     await addMockBlogs(40, ["Aa"]);

//     const res = await req.get(
//       ENDPOINTS.BLOGS + generateFiltersOptions(40, 1, "name")
//     );

//     expect(res.statusCode).toBe(200);
//     expect(res.body.items[0]?.name).not.toEqual("Aa");
//   });

//   test("If sortBy provided and sortDirection shoud return blogs sorted by sortBy in provided sort order", async () => {
//     await addMockBlogs(40, ["Aa"]);

//     const res = await req.get(
//       ENDPOINTS.BLOGS + generateFiltersOptions(40, 1, "name", "asc")
//     );

//     expect(res.statusCode).toBe(200);
//     expect(res.body.items[0]?.name).toEqual("Aa");
//   });
// });

// describe("Testing blogs POST methods", () => {
//   test("Can post only with auth user", async () => {
//     const res = await req.post(ENDPOINTS.BLOGS).send(getMockBlogInput());

//     expect(res.statusCode).toBe(HTTP_STATUS.NO_AUTH);
//   });

//   test("If some field has error, return 400 and errors", async () => {
//     const res = await withAuthCredentials(req.post(ENDPOINTS.BLOGS).send({}));

//     expect(res.statusCode).toBe(HTTP_STATUS.INCORRECT);
//     expect(res.body).toHaveProperty("errorsMessages");
//   });

//   test("If body correct, should return new blog with id", async () => {
//     const mockBlog = getMockBlogInput();
//     const res = await withAuthCredentials(
//       req.post(ENDPOINTS.BLOGS).send(mockBlog)
//     );

//     expect(res.statusCode).toBe(HTTP_STATUS.CREATED);
//     expect(res.body).toHaveProperty("id");
//     expect(res.body).toMatchObject(mockBlog);
//   });
// });

// describe("Testing blogs/:id PUT methods", () => {
//   test("If id invalid or blog not exist, should return 404", async () => {
//     const res = await withAuthCredentials(
//       req.put(ENDPOINTS.BLOGS).send(getMockBlogInput())
//     );

//     expect(res.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
//   });

//   test("If user unauthorize shoud return 401", async () => {
//     const res = await req
//       .put(ENDPOINTS.BLOGS + "/777")
//       .send(getMockBlogInput());

//     expect(res.statusCode).toBe(HTTP_STATUS.NO_AUTH);
//   });

//   test("If body correct, should return 204", async () => {
//     const expected = getMockBlogInput();

//     const mockRes = await withAuthCredentials(
//       req.post(ENDPOINTS.BLOGS).send(getMockBlogInput())
//     );
//     const mockId = mockRes.body.id;

//     const res = await withAuthCredentials(
//       req.put(ENDPOINTS.BLOGS + "/" + mockId).send(expected)
//     );

//     expect(res.statusCode).toBe(HTTP_STATUS.NO_CONTENT);
//   });

//   test("If body correct, blog will be with updated props", async () => {
//     const createBlogRes = await withAuthCredentials(
//       req.post(ENDPOINTS.BLOGS).send(getMockBlogInput())
//     );
//     const blogId = createBlogRes.body.id;

//     const blogRes = await req.get(ENDPOINTS.BLOGS + "/" + blogId);
//     const blog = blogRes.body;

//     const updatedFields = getMockBlogInput();

//     await withAuthCredentials(
//       req.put(ENDPOINTS.BLOGS + "/" + blogId).send(updatedFields)
//     );

//     const res = await req.get(ENDPOINTS.BLOGS + "/" + blogId);

//     expect(res.statusCode).toBe(HTTP_STATUS.SUCCESS);
//     expect(res.body).toEqual({ ...blog, ...updatedFields });
//   });
// });
