import type { Express, Response } from "express";
import { LocalDB } from "../db";

const VIDEOS_MAIN_ROUTE = "/videos";

const db = new LocalDB();

export const videosRoutes = (app: Express) => {
  app.get(VIDEOS_MAIN_ROUTE, (_req, res: Response) => {
    res.send("get videos");
  });

  app.get(`${VIDEOS_MAIN_ROUTE}/:id`, (req, res) => {
    res.send(req.params.id);
  });

  app.post(VIDEOS_MAIN_ROUTE, (req, res) => {
    res.send(req.body);
  });

  app.put(`${VIDEOS_MAIN_ROUTE}/:id`, (req, res) => {
    res.send("update video");
  });

  app.delete(`${VIDEOS_MAIN_ROUTE}/:id`, (req, res) => {
    res.send("delete video");
  });
};
