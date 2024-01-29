import { app } from "./setting";

export const SETTINGS = {
  PORT: 3003,
  VIDEOS_API_PATH: "/hometask_01/api/videos",
  TESTING_API_PATH: "/hometask_01/api/testing/all-data",
} as const;

const port = process.env.PORT || SETTINGS.PORT;

app.listen(port);
