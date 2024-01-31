import type { Express, Response, Request } from "express";
import { LocalDB } from "../db";
import { ENDPOINTS, HTTP_STATUS } from "../constants";
import { VIDEO } from "../types";

const db = new LocalDB();

export const videosRoutes = (app: Express) => {
  app.get(ENDPOINTS.VIDEOS, (_req, res: Response) => {
    return res.status(HTTP_STATUS.SUCCESS).send(db.getAllVideos());
  });

  app.delete(ENDPOINTS.TESTING, (req, res) => {
    db.clearDb();

    return res.status(HTTP_STATUS.SUCCESS).send();
  });

  app.get(`${ENDPOINTS.VIDEOS}/:id`, (req, res) => {
    const result = db.getVideoById(+req.params.id);

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).send();
    }

    return res.status(HTTP_STATUS.SUCCESS).send(req.params.id);
  });

  app.post(ENDPOINTS.VIDEOS, (req: Request<VIDEO>, res) => {
    const result = db.addVideo(req.body);

    if (!(result instanceof LocalDB)) {
      return res
        .status(HTTP_STATUS.INCORRECT)
        .send({ errorMessages: result.errorsMessages });
    }

    return res.status(HTTP_STATUS.CREATED).send(req.body);
  });

  app.put(`${ENDPOINTS.VIDEOS}/:id`, (req, res) => {
    const result = db.updateVideoById(+req.params.id, req.body);

    if (!(result instanceof LocalDB)) {
      const { isError, errorsMessages } = result;

      if (isError && !errorsMessages) {
        return res.status(HTTP_STATUS.NOT_FOUND).send();
      }

      return res
        .status(HTTP_STATUS.INCORRECT)
        .send({ errorMessages: result.errorsMessages });
    }

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  });

  app.delete(`${ENDPOINTS.VIDEOS}/:id`, (req, res) => {
    if (!db.getVideoById(+req.params.id)) {
      return res.status(HTTP_STATUS.NOT_FOUND).send();
    }

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  });
};
