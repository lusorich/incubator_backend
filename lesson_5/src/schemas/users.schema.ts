import { trimSanitizer, getCommonErrorMsg } from "../helpers";

const loginValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 3, max: 10 } },
  errorMessage: getCommonErrorMsg("login"),
  matches: {
    options: /^[a-zA-Z0-9_-]*$/,
  },
};

const passwordValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 6, max: 20 } },
  errorMessage: getCommonErrorMsg("password"),
};

const emailValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  errorMessage: getCommonErrorMsg("email"),
  matches: {
    options: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
};

export const usersSchema = {
  email: emailValidator,
  password: passwordValidator,
  login: loginValidator,
};
