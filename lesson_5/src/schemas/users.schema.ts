const loginValidator = {
  customSanitizer: {
    options: (value: string) => {
      return value?.trim();
    },
  },
  isString: true,
  isLength: { options: { min: 3, max: 10 } },
  errorMessage: "Wrong login",
  matches: {
    options: /^[a-zA-Z0-9_-]*$/,
  },
};

const passwordValidator = {
  customSanitizer: {
    options: (value: string) => {
      return value?.trim();
    },
  },
  isString: true,
  isLength: { options: { min: 6, max: 20 } },
  errorMessage: "Wrong Password",
};

const emailValidator = {
  customSanitizer: {
    options: (value: string) => {
      return value?.trim();
    },
  },
  isString: true,
  errorMessage: "Wrong Email",
  matches: {
    options: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
};

export const usersSchema = {
  email: emailValidator,
  password: passwordValidator,
  login: loginValidator,
};
