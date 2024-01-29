import express from "express";

export const SETTINGS = {
  PORT: 3003,
  VIDEOS_API_PATH: "/hometask_01/api/videos",
  TESTING_API_PATH: "/hometask_01/api/testing/all-data",
} as const;

export const app = express();

app.get(SETTINGS.VIDEOS_API_PATH, (req, res) => {
  res.send("get videos");
});

app.get(`${SETTINGS.VIDEOS_API_PATH}/:id`, (req, res) => {
  res.send(req.params.id);
});

app.post(SETTINGS.VIDEOS_API_PATH, (req, res) => {
  res.send("get videos");
});

app.put(`${SETTINGS.VIDEOS_API_PATH}/:id`, (req, res) => {
  res.send("update video");
});

app.delete(`${SETTINGS.VIDEOS_API_PATH}/:id`, (req, res) => {
  res.send("delete video");
});
