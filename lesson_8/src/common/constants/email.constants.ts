import { SETTINGS } from "../../constants";

export const DEFAULT_TRANSPORT_SETTINGS = {
  service: "Mail.ru",
  auth: {
    user: "eeugern@mail.ru",
    pass: SETTINGS.MAIL_KEY,
  },
};
