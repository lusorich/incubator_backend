import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResult = exception.getResponse();

    if (typeof exceptionResult === 'object' && 'message' in exceptionResult) {
      response.status(status).json({
        errorsMessages: exceptionResult.message,
      });
    } else {
      response.status(status).json({
        exceptionResult,
      });
    }
  }
}
