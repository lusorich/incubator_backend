import { SETTINGS } from "./constants";
import { app } from "./settings";

const port = process.env.PORT || SETTINGS.PORT;

app.listen(port);
