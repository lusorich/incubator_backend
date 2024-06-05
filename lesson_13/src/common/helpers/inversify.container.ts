import 'reflect-metadata';
import { Container } from 'inversify';
import { UsersQueryRepository } from '../../features/users/repositories/users.query.repository';
import { UsersController } from '../../features/users/controller/users.controller';
import { UsersService } from '../../features/users/application/users.service';
import { UsersCommandsRepository } from '../../features/users/repositories/users.commands.repository';

export const container = new Container();

container.bind<UsersQueryRepository>(UsersQueryRepository).toSelf();
container.bind<UsersCommandsRepository>(UsersCommandsRepository).toSelf();
container.bind<UsersController>(UsersController).toSelf();
container.bind<UsersService>(UsersService).toSelf();
