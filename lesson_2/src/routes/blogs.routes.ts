import { type Express, type Response, type Request, Router } from "express";
import { ENDPOINTS } from "../constants";

export const blogsRouter = Router({});

blogsRouter
  .route(ENDPOINTS.BLOGS)
  .get((req, res) => {
    res.send("get blogs");
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
