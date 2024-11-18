import express from "express";
import routes from "./routes/routes";
import { SETTINGS } from "./constants";
import cookieParser from "cookie-parser";
import { runDb } from "./db/db";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", true);

routes(app);

const port = process.env.PORT || SETTINGS.PORT;

export const server = app.listen(port);

runDb();
