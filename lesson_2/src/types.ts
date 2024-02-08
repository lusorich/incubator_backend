export interface Blog {
  name: string;
  description: string;
  websiteUrl: string;
}

export interface BlogWithId extends Blog {
  id: string;
}

export interface Database {
  blogs: BlogWithId[];
}

export type FieldError = {
  message: string;
  field: string;
};

export type ErrorsMessages = {
  errorsMessages: FieldError[];
};
