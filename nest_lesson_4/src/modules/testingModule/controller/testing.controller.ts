import { Controller, HttpStatus, HttpCode, Delete } from '@nestjs/common';
import { BlogsService } from 'src/modules/blogsModule/blogs/application/blogs.service';
import { CommentsService } from 'src/modules/blogsModule/comments/application/comments.service';
import { LikesService } from 'src/modules/blogsModule/likes/application/likes.service';
import { PostsService } from 'src/modules/blogsModule/posts/application/posts.service';
import { SecurityService } from 'src/modules/securityModule/application/security.service';
import { UsersService } from 'src/modules/usersModule/users/application/users.service';

@Controller('testing')
export class TestingController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
    private readonly securityService: SecurityService,
  ) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.usersService.deleteAll();
    await this.blogsService.deleteAll();
    await this.postsService.deleteAll();
    await this.commentsService.deleteAll();
    await this.likesService.deleteAll();
    await this.securityService.deleteAll();
  }
}
