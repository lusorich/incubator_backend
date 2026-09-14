import { getCommonErrorMsg, trimSanitizer } from "../helpers";

const passwordValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  errorMessage: getCommonErrorMsg("password"),
};

const loginOrEmailValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  errorMessage: getCommonErrorMsg("loginOrEmail"),
};

export const authSchema = {
  loginOrEmail: loginOrEmailValidator,
  password: passwordValidator,
};
