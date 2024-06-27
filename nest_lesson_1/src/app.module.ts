import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './features/users/controller/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersService } from './features/users/application/users.service';
import { UsersQueryRepository } from './features/users/repositories/users.repository.query';
import { UsersCommandsRepository } from './features/users/repositories/users.repository.commands';
import { BlogsQueryRepository } from './features/blogs/repositories/blogs.repository.query';
import { BlogsController } from './features/blogs/controller/blogs.controller';
import { Blog, BlogSchema } from './features/blogs/domain/blog.entity';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [AppController, UsersController, BlogsController],
  providers: [
    AppService,
    UsersService,
    UsersQueryRepository,
    UsersCommandsRepository,

    BlogsQueryRepository,
  ],
})
export class AppModule {}
