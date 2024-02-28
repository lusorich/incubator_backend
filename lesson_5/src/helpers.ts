import { ValidationError } from "express-validator";
import { FieldError } from "./types";
import { ParsedQs } from "qs";
import { SortDirection } from "./constants";

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

export const getFiltersFromQuery = (query: ParsedQs) => {
  const pagination = {
    pageNumber: +(query.pageNumber || 1),
    pageSize: +(query.pageSize || 10),
  };

  const sortDirection = (): SortDirection => {
    if (query.sortDirection === SortDirection.ASC) {
      return SortDirection.ASC;
    }

    return SortDirection.DESC;
  };

  const sortBy = (query.sortBy && String(query.sortBy)) || "createdAt";
  const searchNameTerm = (query.searchNameTerm as string | undefined) || null;
  const searchLoginTerm = (query.searchLoginTerm as string | undefined) || null;
  const searchEmailTerm = (query.searchEmailTerm as string | undefined) || null;

  return {
    pagination,
    sortDirection: sortDirection(),
    sortBy,
    searchNameTerm,
    searchEmailTerm,
    searchLoginTerm,
  };
};
