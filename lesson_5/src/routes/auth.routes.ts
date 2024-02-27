import { Router, type Response, type Request } from "express";
import { ENDPOINTS } from "../constants";

export const authRouter = Router({});

authRouter.route(ENDPOINTS.LOGIN).post(async (req: Request, res: Response) => {
  res.send("Hello login");
});
