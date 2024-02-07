import { type Express, type Response, type Request, Router } from "express";
import { ENDPOINTS } from "../constants";

export const testingRouter = Router({});

testingRouter.route(ENDPOINTS.TESTING).delete((req, res) => {
  res.send("Get");
});
