import { app } from "./settings";

export const SETTINGS = {
  PORT: 3003,
} as const;

const port = process.env.PORT || SETTINGS.PORT;

app.listen(port);
