import type { Express, Response } from "express";
import { LocalDB } from "../db";
import { ENDPOINTS } from "../constants";

const db = new LocalDB();

export const videosRoutes = (app: Express) => {
  app.get(ENDPOINTS.VIDEOS, (_req, res: Response) => {
    res.send("get videos");
  });

  app.get(`${ENDPOINTS.VIDEOS}/:id`, (req, res) => {
    res.send(req.params.id);
  });

  app.post(ENDPOINTS.VIDEOS, (req, res) => {
    res.send(req.body);
  });

  app.put(`${ENDPOINTS.VIDEOS}/:id`, (req, res) => {
    res.send("update video");
  });

  app.delete(`${ENDPOINTS.VIDEOS}/:id`, (req, res) => {
    res.send("delete video");
  });
};
