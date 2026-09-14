import { REGEXP } from "../constants";
import { trimSanitizer, getCommonErrorMsg } from "../helpers";

const loginValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 3, max: 10 } },
  errorMessage: getCommonErrorMsg("login"),
  matches: {
    options: REGEXP.LOGIN,
  },
};

export const passwordValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 6, max: 20 } },
  errorMessage: getCommonErrorMsg("password"),
};

export const emailValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  errorMessage: getCommonErrorMsg("email"),
  matches: {
    options: REGEXP.EMAIL,
  },
};

export const usersSchema = {
  email: emailValidator,
  password: passwordValidator,
  login: loginValidator,
};
