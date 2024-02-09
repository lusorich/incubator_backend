import express from "express";
import routes from "./routes/routes";
import { SETTINGS } from "./constants";

export const app = express();

app.use(express.json());

routes(app);

const port = process.env.PORT || SETTINGS.PORT;

app.listen(port);
