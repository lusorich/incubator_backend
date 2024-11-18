import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';

@Injectable()
export class PostsCommandsRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async create({ title, shortDescription, content, blogId, blogName }) {
    const post: PostDocument = this.PostModel.createPost({
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    });

    return this.save(post);
  }

  async update({ newData, id }) {
    return this.PostModel.updateOne({ _id: id }, { ...newData });
  }

  async save(post: PostDocument) {
    return post.save();
  }

  async delete(id: number) {
    return this.PostModel.deleteOne({ _id: id });
  }

  async deleteAll() {
    return this.PostModel.deleteMany({});
  }
}
