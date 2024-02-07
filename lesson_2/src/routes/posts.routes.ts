import { type Express, type Response, type Request, Router } from "express";
import { ENDPOINTS } from "../constants";

export const postsRouter = Router({});

postsRouter
  .route(ENDPOINTS.POSTS)
  .get((req, res) => {
    res.send("Get");
  })
  .post((req, res) => {
    res.send("Post");
  });

postsRouter
  .route(ENDPOINTS.POSTS_ID)
  .get((req, res) => {
    res.send("Get concrete posts");
  })
  .post((req, res) => {
    res.send("Create new post");
  })
  .delete((req, res) => {
    res.send("Delete new posts");
  });
