import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResult = exception.getResponse();
    //TODO: maybe it's all wrong
    if (status === HttpStatus.UNAUTHORIZED) {
      return response.sendStatus(HttpStatus.UNAUTHORIZED);
    }

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
