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

    //TODO: Here we catch jwt auth errors, but we can do it in jwt guard
    if (status === HttpStatus.UNAUTHORIZED) {
      return response.sendStatus(HttpStatus.UNAUTHORIZED);
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(exceptionResult);
  }
}
