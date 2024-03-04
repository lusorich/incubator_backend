import { trimSanitizer, getCommonErrorMsg } from "../helpers";

export const titleValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 1, max: 30 } },
  errorMessage: getCommonErrorMsg("title"),
};

export const shortDescriptionValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 1, max: 100 } },
  errorMessage: getCommonErrorMsg("short description"),
};

export const contentValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  isLength: { options: { min: 1, max: 1000 } },
  errorMessage: getCommonErrorMsg("content"),
};

export const blogIdValidator = {
  customSanitizer: trimSanitizer,
  isString: true,
  errorMessage: getCommonErrorMsg("blogId"),
};

export const postsSchema = {
  title: titleValidator,
  shortDescription: shortDescriptionValidator,
  content: contentValidator,
  blogId: blogIdValidator,
};
