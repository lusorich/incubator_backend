import { Controller, HttpStatus, HttpCode, Delete } from '@nestjs/common';
import { PostsService } from 'src/features/posts/application/posts.service';
import { UsersService } from 'src/features/users/application/users.service';
import { BlogsService } from 'src/features/blogs/application/blogs.service';
import { CommentsService } from 'src/features/comments/application/comments.service';
import { LikesService } from 'src/features/likes/application/likes.service';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
  ) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.usersService.deleteAll();
    await this.blogsService.deleteAll();
    await this.postsService.deleteAll();
    await this.commentsService.deleteAll();
    await this.likesService.deleteAll();
  }
}
