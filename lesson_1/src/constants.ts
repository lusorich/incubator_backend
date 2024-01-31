import { Schema, RESOLUTION } from "./types";

export const SETTINGS = {
  PORT: 3003,
} as const;

export const enum ENDPOINTS {
  VIDEOS = "/videos",
  TESTING = "/testing/all-data",
}

export const enum ERRORS {
  FIELD_NOT_EXIST = "FIELSS_NOT_EXIST",
  WRONG_VALUE = "WRONG_VALUE",
}

export const enum HTTP_STATUS {
  SUCCESS = 200,
  NOT_FOUND = 404,
  INCORRECT = 400,
  NO_CONTENT = 204,
}

export const schema: Schema = {
  id: (value) => {
    if (typeof value !== "number" || !value) {
      return false;
    }

    return true;
  },
  author: (value) => {
    if (typeof value !== "string" || !value) {
      return false;
    }

    return true;
  },
  title: (value) => {
    if (typeof value !== "string" || !value) {
      return false;
    }

    return true;
  },
  canBeDownloaded: (value) => {
    if (typeof value !== "boolean") {
      return false;
    }

    return true;
  },
  minAgeRestriction: (value) => {
    if (typeof value !== "number" || value > 18 || value < 1) {
      return false;
    }

    return true;
  },
  createdAt: (value) => {
    if (typeof value !== "string") {
      return false;
    }

    return true;
  },
  publicationDate: (value) => {
    if (typeof value !== "string") {
      return false;
    }

    return true;
  },
  availableResolutions: (value) => {
    if (!Array.isArray(value)) {
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!validResolutions.includes(value[i])) {
        return false;
      }
    }

    return true;
  },
};

export const validKeys = [
  "id",
  "author",
  "canBeDownloaded",
  "minAgeRestriction",
  "createdAt",
  "publicationDate",
  "availableResolutions",
] as const;

export const validResolutions: RESOLUTION[] = [
  "P144",
  "P240",
  "P360",
  "P480",
  "P720",
  "P1080",
  "P1440",
  "P2160",
];
