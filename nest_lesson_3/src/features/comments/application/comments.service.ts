import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(private commentsCommandsRepository) {}
}
