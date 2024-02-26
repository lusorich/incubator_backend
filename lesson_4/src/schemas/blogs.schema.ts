export const blogNameValidator = {
  customSanitizer: {
    options: (value: string) => {
      return value?.trim();
    },
  },
  isString: true,
  isLength: { options: { min: 1, max: 15 } },
  errorMessage: "Wrong name",
};

export const blogsSchema = {
  name: blogNameValidator,
  description: {
    customSanitizer: {
      options: (value: string) => {
        return value?.trim();
      },
    },
    isString: true,
    isLength: { options: { min: 1, max: 500 } },
    errorMessage: "Wrong description",
  },
  websiteUrl: {
    customSanitizer: {
      options: (value: string) => {
        return value?.trim();
      },
    },
    isString: true,
    isLength: { options: { min: 1, max: 100 } },
    errorMessage: "Wrong websiteUrl",
    matches: {
      options:
        /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    },
  },
};
