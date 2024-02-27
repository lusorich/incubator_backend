import { Router, type Response, type Request } from "express";
import { ENDPOINTS } from "../constants";

export const usersRouter = Router({});

usersRouter
  .route(ENDPOINTS.USERS)
  .get(async (req: Request, res: Response) => {
    res.send("Hello users");
  })
  .post(async (req: Request, res: Response) => {
    res.send("Hello add user");
  });

usersRouter
  .route(ENDPOINTS.USERS_ID)
  .delete(async (req: Request, res: Response) => {
    res.send("Hello delete user");
  });
