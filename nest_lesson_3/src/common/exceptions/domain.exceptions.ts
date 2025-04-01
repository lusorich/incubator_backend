import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainExceptionCode } from './domain.exception.codes';

interface ValidationFieldError {
  message: string;
  field: string;
}

export class DomainException extends Error {
  message: string;
  code: DomainExceptionCode;
  errorsMessages: ValidationFieldError[];

  //TODO: need better types
  constructor(errorInfo: {
    code: DomainExceptionCode;
    message?: string;
    errorsMessages?: ValidationFieldError[];
  }) {
    super(errorInfo.message);
    this.message = errorInfo.message ?? '';
    this.code = errorInfo.code;
    this.errorsMessages = errorInfo.errorsMessages;
  }
}

@Catch(DomainException)
export class DomainHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.mapToHttpStatus(exception.code);
    const responseBody = this.buildResponseBody(exception);

    response.status(status).json(responseBody);
  }

  private mapToHttpStatus(code: DomainExceptionCode): number {
    switch (code) {
      case DomainExceptionCode.BadRequest:
      case DomainExceptionCode.ValidationError:
      case DomainExceptionCode.ConfirmationCodeExpired:
      case DomainExceptionCode.EmailNotConfirmed:
      case DomainExceptionCode.PasswordRecoveryCodeExpired:
        return HttpStatus.BAD_REQUEST;
      case DomainExceptionCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case DomainExceptionCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case DomainExceptionCode.Unauthorized:
        return HttpStatus.UNAUTHORIZED;
      case DomainExceptionCode.InternalServerError:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.I_AM_A_TEAPOT;
    }
  }

  private buildResponseBody(exception: DomainException): {
    message?: string;
    errorsMessages?: ValidationFieldError[];
  } {
    return Object.fromEntries(
      Object.entries({
        message: exception.message,
        errorsMessages: exception.errorsMessages,
      }).filter(([_, value]) => !!value),
    );
  }
}
