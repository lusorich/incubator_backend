import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesService {
  constructor() {}

  async createLike({ content, userId, userLogin, postId }) {
    return null;
  }

  async updateLike({}) {}
}
