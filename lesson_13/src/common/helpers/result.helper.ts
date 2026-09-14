import { Result } from '../types/common.types';
import 'reflect-metadata';
import { injectable } from 'inversify';

@injectable()
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
