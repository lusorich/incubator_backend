type Nullable<T> = null | T;

type RESOLUTION =
  | "P144"
  | "P240"
  | "P360"
  | "P480"
  | "P720"
  | "P1080"
  | "P1440"
  | "P2160";

export type VIDEO = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: Nullable<number>;
  createdAt?: Date;
  publicationDate?: Date;
  availableResolutions: Nullable<RESOLUTION[]>;
};
