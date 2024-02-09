import express from "express";
import routes from "./routes/routes";
import { HTTP_STATUS, SETTINGS } from "./constants";
import { type Response, type Request, NextFunction } from "express";

export const app = express();

app.use(express.json());

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.originalUrl.includes("testing") &&
    req.method !== "GET" &&
    (!req.headers.authorization ||
      req.headers.authorization !== "Basic YWRtaW46cXdlcnR5")
  ) {
    return res.sendStatus(HTTP_STATUS.NO_AUTH);
  }

  return next();
});

routes(app);

const port = process.env.PORT || SETTINGS.PORT;

app.listen(port);
