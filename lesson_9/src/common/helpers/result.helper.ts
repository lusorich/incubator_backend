import { Result } from "../types/common.types";

export class ResultObject {
  getResult<T>({ data, status, errorMessage }: Result<T>) {
    if (!data) {
    }
    return {
      data,
      status,
      errorMessage,
    };
  }
}
