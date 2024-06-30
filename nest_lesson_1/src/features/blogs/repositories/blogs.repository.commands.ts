import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';

@Injectable()
export class BlogsCommandsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async create({ name, description, websiteUrl }) {
    const blog: BlogDocument = this.BlogModel.createBlog({
      name,
      description,
      websiteUrl,
    });

    return this.save(blog);
  }

  async update({ newData, id }) {
    return this.BlogModel.updateOne({ _id: id }, { ...newData });
  }

  async save(blog: BlogDocument) {
    return blog.save();
  }

  async delete(id: number) {
    return this.BlogModel.deleteOne({ _id: id });
  }
}
