import 'reflect-metadata';
import { Container } from 'inversify';
import { UsersQueryRepository } from '../../features/users/repositories/users.query.repository';
import { UsersController } from '../../features/users/controller/users.controller';

export const container = new Container();

container.bind<UsersQueryRepository>(UsersQueryRepository).toSelf();
container.bind<UsersController>(UsersController).toSelf();
