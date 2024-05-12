export type Result<T> = {
  status: COMMON_RESULT_STATUSES;
  data: T;
  errorMessage?: string;
};

export enum COMMON_RESULT_STATUSES {
  SUCCESS,
  ERROR,
  NOT_FOUND,
}
