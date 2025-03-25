import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from 'src/common/exception.filter';
import { MongooseExceptionFilter } from 'src/common/mongoose.exception.filter';
import * as cookieParser from 'cookie-parser';
import { swaggerSetup } from './swaggerSetup';
import {
  DomainException,
  DomainHttpExceptionsFilter,
} from 'src/common/exceptions/domain.exceptions';
import { DomainExceptionCode } from 'src/common/exceptions/domain.exception.codes';

export const applyAppSettings = (app: INestApplication) => {
  // Для внедрения зависимостей в validator constraint
  // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
  // когда DI не имеет необходимого класса.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  setAppPipes(app);

  setAppExceptionsFilters(app);

  swaggerSetup(app);

  app.use(cookieParser());
  app.enableCors();
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];

        errors.forEach((err) => {
          const keys = Object.keys(err.constraints);

          keys.forEach((k) => {
            errorsForResponse.push({
              message: err.constraints[k],
              field: err.property,
            });
          });
        });

        throw new DomainException({
          code: DomainExceptionCode.ValidationError,
          errorsMessages: errorsForResponse,
        });

        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(
    new DomainHttpExceptionsFilter(),
    new HttpExceptionFilter(),
    new MongooseExceptionFilter(),
  );
};
