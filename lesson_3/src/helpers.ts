import { ValidationError } from "express-validator";
import { FieldError } from "./types";

export const getFormattedErrors = (errors: ValidationError[]) => {
  const formattedErrors = errors.reduce<{ errorsMessages: FieldError[] }>(
    (acc, error) => {
      const formattedError: FieldError = {
        //@ts-ignore
        field: error?.path || "",
        message: error.msg,
      };

      acc.errorsMessages.push(formattedError);

      return acc;
    },
    { errorsMessages: [] }
  );

  return formattedErrors;
};
