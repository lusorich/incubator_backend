import { Module } from '@nestjs/common';
import { UsersController } from './features/users/controller/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersService } from './features/users/application/users.service';
import { UsersQueryRepository } from './features/users/repositories/users.repository.query';
import { UsersCommandsRepository } from './features/users/repositories/users.repository.commands';
import { BlogsQueryRepository } from './features/blogs/repositories/blogs.repository.query';
import { BlogsController } from './features/blogs/controller/blogs.controller';
import { Blog, BlogSchema } from './features/blogs/domain/blog.entity';
import { BlogsCommandsRepository } from './features/blogs/repositories/blogs.repository.commands';
import { BlogsService } from './features/blogs/application/blogs.service';
import { PostsService } from './features/posts/application/posts.service';
import { PostsQueryRepository } from './features/posts/repositories/posts.repository.query';
import { PostsCommandsRepository } from './features/posts/repositories/posts.repository.commands';
import { PostsController } from './features/posts/controller/posts.controller';
import { Post, PostSchema } from './features/posts/domain/post.entity';
import { TestingController } from './features/testing/controller/testing.controller';
import { appSettings } from './settings/appSettings';
import { AuthController } from './features/auth/controller/auth.controller';
import { IsUserAlreadyExistConstraint } from './common/IsUserAlreadyExist';
import { AuthService } from './features/auth/application/auth.service';
import { AuthCommandsRepository } from './features/auth/repositories/auth.repository.commands';

@Module({
  imports: [
    MongooseModule.forRoot(
      appSettings.env.isTesting()
        ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
        : appSettings.api.MONGO_CONNECTION_URI,
    ),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [
    UsersController,
    BlogsController,
    PostsController,
    TestingController,
    AuthController,
  ],
  providers: [
    UsersService,
    UsersQueryRepository,
    UsersCommandsRepository,

    BlogsService,
    BlogsQueryRepository,
    BlogsCommandsRepository,

    PostsService,
    PostsQueryRepository,
    PostsCommandsRepository,

    IsUserAlreadyExistConstraint,

    AuthService,
    AuthCommandsRepository,
  ],
})
export class AppModule {}
