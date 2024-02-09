import { db } from "../db/db";

export const postTitleValidator = {
  customSanitizer: {
    options: (value: string) => {
      return value?.trim();
    },
  },
  isString: true,
  isLength: { options: { min: 1, max: 30 } },
  errorMessage: "Wrong title",
};

export const postsSchema = {
  title: postTitleValidator,
  shortDescription: {
    customSanitizer: {
      options: (value: string) => {
        return value?.trim();
      },
    },
    isString: true,
    isLength: { options: { min: 1, max: 100 } },
    errorMessage: "Wrong short description",
  },
  content: {
    customSanitizer: {
      options: (value: string) => {
        return value?.trim();
      },
    },
    isString: true,
    isLength: { options: { min: 1, max: 10000 } },
    errorMessage: "Wrong content",
  },
  blogId: {
    customSanitizer: {
      options: (value: string) => {
        return value?.trim();
      },
    },
    custom: {
      options: (value: string) => {
        if (db.getBlogById(value)) {
          return true;
        }
        return value;
      },
      bail: true,
    },
    isString: true,
    errorMessage: "Wrong blogId",
  },
};
