import { COMMON_RESULT_STATUSES } from "../types/common.types";

export class ResultObject {
  getResult<T>({
    data,
    status,
    errorMessage,
  }: {
    data: T;
    status: COMMON_RESULT_STATUSES;
    errorMessage?: string;
  }) {
    if (!data) {
    }
    return {
      data,
      status,
      errorMessage,
    };
  }
}
