import { Module } from '@nestjs/common';
import { BlogsQueryRepository } from './blogs/repositories/blogs.repository.query';
import { BlogsCommandsRepository } from './blogs/repositories/blogs.repository.commands';
import { PostsQueryRepository } from './posts/repositories/posts.repository.query';
import { PostsCommandsRepository } from './posts/repositories/posts.repository.commands';
import { CommentsQueryRepository } from './comments/repositories/comments.repository.query';
import { CommentsCommandsRepository } from './comments/repositories/comments.repository.commands';
import { BlogsController } from './blogs/controller/blogs.controller';
import { PostsController } from './posts/controller/posts.controller';
import { CommentsController } from './comments/controller/comments.controller';
import { LikesQueryRepository } from './likes/repositories/likes.repository.query';
import { LikesCommandsRepository } from './likes/repositories/likes.repository.commands';
import { BlogsService } from './blogs/application/blogs.service';
import { PostsService } from './posts/application/posts.service';
import { CommentsService } from './comments/application/comments.service';
import { LikesService } from './likes/application/likes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { Post, PostSchema } from './posts/domain/post.entity';
import { Like, LikeSchema } from './likes/domain/like.entity';
import { CommentSchema } from './comments/domain/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsQueryRepository,
    BlogsCommandsRepository,
    PostsQueryRepository,
    PostsCommandsRepository,
    CommentsQueryRepository,
    CommentsCommandsRepository,
    LikesQueryRepository,
    LikesCommandsRepository,

    BlogsService,
    PostsService,
    CommentsService,
    LikesService,
  ],
  exports: [],
})
export class BlogsModule {}
