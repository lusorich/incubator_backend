import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { appSettings } from './settings/appSettings';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { CommentsService } from './features/comments/application/comments.service';
import {
  Comment,
  CommentSchema,
} from './features/comments/domain/comment.entity';
import { CommentsController } from './features/comments/controller/comments.controller';
import { CommentsCommandsRepository } from './features/comments/repositories/comments.repository.commands';
import { CommentsQueryRepository } from './features/comments/repositories/comments.repository.query';
import { IsCommentExistConstraint } from './common/IsCommentExist';
import { LikesService } from './features/likes/application/likes.service';
import { LikesCommandsRepository } from './features/likes/repositories/likes.repository.commands';
import { LikesQueryRepository } from './features/likes/repositories/likes.repository.query';
import { Like, LikeSchema } from './features/likes/domain/like.entity';
import { IsBlogExistConstraint } from './common/IsBlogExist';
import { UsersModule } from './modules/usersModule/users.module';
import { CommonModule } from './modules/commonModule/common.module';
import { NotificationModule } from './modules/notificationModule/notifications.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      appSettings.env.isTesting()
        ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
        : appSettings.api.MONGO_CONNECTION_URI,
    ),
    MailerModule.forRoot({
      transport: {
        service: 'Mail.ru',
        auth: {
          user: appSettings.api.MAIL_USER,
          pass: appSettings.api.MAIL_PASSWORD,
        },
      },
    }),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: appSettings.api.SECRET_JWT_KEY,
      signOptions: { expiresIn: '5m' },
    }),
    UsersModule,
    CommonModule,
    NotificationModule,
  ],
  controllers: [
    BlogsController,
    PostsController,
    //    TestingController,
    CommentsController,
  ],
  providers: [
    BlogsService,
    BlogsQueryRepository,
    BlogsCommandsRepository,

    PostsService,
    PostsQueryRepository,
    PostsCommandsRepository,

    IsCommentExistConstraint,
    IsBlogExistConstraint,

    CommentsService,
    CommentsCommandsRepository,
    CommentsQueryRepository,

    LikesService,
    LikesCommandsRepository,
    LikesQueryRepository,
  ],
})
export class AppModule {}
