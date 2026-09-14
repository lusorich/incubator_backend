import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongooseError } from 'mongoose';

@Catch(MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const name = exception.name;

    if (name === 'CastError') {
      return response.sendStatus(HttpStatus.NOT_FOUND);
    }

    return response.status(500).json({
      error: exception.message,
    });
  }
}
