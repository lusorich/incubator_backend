import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { HttpExceptionFilter } from './common/exception.filter';

export const appSettings = (app: INestApplication) => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

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

        throw new BadRequestException(errorsForResponse);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
};
