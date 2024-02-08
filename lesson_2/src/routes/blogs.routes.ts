import { type Express, type Response, type Request, Router } from "express";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { BlogsRepository } from "../repositories/blogs.repository";

export const blogsRouter = Router({});

const blogsRepository = new BlogsRepository();

blogsRouter
  .route(ENDPOINTS.BLOGS)
  .get((_req: Request, res: Response) => {
    res.status(HTTP_STATUS.SUCCESS).json(blogsRepository.getAllBlogs());
  })
  .post((req, res) => {
    res.send("post blogs");
  });

blogsRouter
  .route(ENDPOINTS.BLOGS_ID)
  .get((req, res) => {
    res.send("cocn blog");
  })
  .put((req, res) => {
    res.send("put");
  })
  .delete((req, res) => {
    res.send("delete");
  });
