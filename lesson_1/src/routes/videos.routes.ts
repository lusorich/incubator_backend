import type { Express, Response, Request } from "express";
import { LocalDB } from "../db";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { VIDEO } from "../types";

const db = new LocalDB();

export const videosRoutes = (app: Express) => {
  app.get(ENDPOINTS.VIDEOS, (_req, res: Response) => {
    res.status(HTTP_STATUS.SUCCESS).send(db.getAllVideos());
  });

  app.delete(ENDPOINTS.TESTING, (req, res) => {
    db.clearDb();

    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

  app.get(`${ENDPOINTS.VIDEOS}/:id`, (req, res) => {
    const result = db.getVideoById(+req.params.id);

    if (!result) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.SUCCESS).send(result);
  });

  app.post(ENDPOINTS.VIDEOS, (req: Request<VIDEO>, res) => {
    const result = db.addVideo(req.body);

    if ("isError" in result) {
      return res
        .status(HTTP_STATUS.INCORRECT)
        .json({ errorsMessages: result.errorsMessages })
        .send();
    }

    return res.status(HTTP_STATUS.CREATED).send(result);
  });

  app.put(`${ENDPOINTS.VIDEOS}/:id`, (req, res) => {
    const result = db.updateVideoById(+req.params.id, req.body);

    if ("isError" in result) {
      const { isError, errorsMessages } = result;

      if (isError && !errorsMessages) {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

      return res
        .status(HTTP_STATUS.INCORRECT)
        .json({ errorsMessages: result.errorsMessages });
    }

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

  app.delete(`${ENDPOINTS.VIDEOS}/:id`, (req, res) => {
    if (!db.getVideoById(+req.params.id)) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    db.deleteVideo(+req.params.id);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
};
