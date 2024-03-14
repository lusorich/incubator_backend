import express from "express";
import routes from "./routes/routes";
import { SETTINGS } from "./constants";

import { runDb } from "./db/db";

export const app = express();

app.use(express.json());

routes(app);

const port = process.env.PORT || SETTINGS.PORT;

export const server = app.listen(port);

runDb();
