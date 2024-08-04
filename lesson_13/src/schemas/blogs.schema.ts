import { REGEXP } from "../constants";
import { trimSanitizer, getCommonErrorMsg } from "../helpers";

export const blogNameValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 1, max: 15 } },
  errorMessage: getCommonErrorMsg("name"),
};

export const descriptionValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 1, max: 500 } },
  errorMessage: getCommonErrorMsg("description"),
};

export const websiteUrlValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 1, max: 100 } },
  errorMessage: getCommonErrorMsg("websiteUrl"),
  matches: {
    options: REGEXP.URL,
  },
};

export const blogsSchema = {
  name: blogNameValidator,
  description: descriptionValidator,
  websiteUrl: websiteUrlValidator,
};
