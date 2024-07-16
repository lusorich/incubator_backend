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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [UsersController, BlogsController, PostsController],
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
  ],
})
export class AppModule {}
