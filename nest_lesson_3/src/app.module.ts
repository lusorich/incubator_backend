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
import { AuthService } from './features/auth/application/auth.service';
import { AuthCommandsRepository } from './features/auth/repositories/auth.repository.commands';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './features/mail/application/mail.service';
import { IsConfirmationCodeActiveConstraint } from './common/IsConfirmationCodeActive';
import { IsUserByConfirmationCodeExistConstraint } from './common/IsUserByConfirmationCodeExist';
import { IsEmailNotConfirmedConstraint } from './common/IsEmailNotConfirmed';
import { IsUserNotExistConstraint } from './common/IsUserNotExist';
import { IsUserAlreadyExistConstraint } from './common/IsUserAlreadyExist';
import { IsUserByRecoveryCodeExistConstraint } from './common/IsUserByRecoveryCodeExist';
import { IsPasswordRecoveryCodeUsedConstraint } from './common/IsPasswordRecoveryCodeUsed';
import { LocalStrategy } from './features/auth/application/auth.local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './features/auth/application/auth.jwt.strategy';
import { CommentsService } from './features/comments/application/comments.service';
import {
  Comment,
  CommentSchema,
} from './features/comments/domain/comment.entity';
import { CommentsController } from './features/comments/controller/comments.controller';
import { CommentsCommandsRepository } from './features/comments/repositories/comments.repository.commands';
import { CommentsQueryRepository } from './features/comments/repositories/comments.repository.query';
import { IsCommentExistConstraint } from './common/IsCommentExist';

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
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: appSettings.api.SECRET_JWT_KEY,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [
    UsersController,
    BlogsController,
    PostsController,
    TestingController,
    AuthController,
    CommentsController,
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

    IsUserNotExistConstraint,
    IsConfirmationCodeActiveConstraint,
    IsUserByConfirmationCodeExistConstraint,
    IsEmailNotConfirmedConstraint,
    IsUserAlreadyExistConstraint,
    IsUserByRecoveryCodeExistConstraint,
    IsPasswordRecoveryCodeUsedConstraint,
    IsCommentExistConstraint,

    AuthService,
    LocalStrategy,
    JwtStrategy,
    AuthCommandsRepository,

    EmailService,

    CommentsService,
    CommentsCommandsRepository,
    CommentsQueryRepository,
  ],
})
export class AppModule {}
