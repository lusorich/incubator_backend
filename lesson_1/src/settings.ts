import express from "express";
import routes from "./routes/routes";

export const SETTINGS = {
  PORT: 3003,
} as const;

export enum ENDPOINTS {
  VIDEOS = "/videos",
  TESTING = "/testing/all-data",
}

export const app = express();

app.use(express.json());

routes(app);
