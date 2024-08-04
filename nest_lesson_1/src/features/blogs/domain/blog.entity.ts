import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class Blog {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  websiteUrl: string;

  @Prop()
  isMembership: boolean;

  @Prop()
  createdAt: Date;

  static createBlog({ name, description, websiteUrl }) {
    const blog = new this();

    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    blog.isMembership = false;
    blog.createdAt = new Date();

    return blog;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.loadClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;

type BlogModelStaticType = {
  createBlog: ({
    name,
    description,
    websiteUrl,
  }: {
    name: string;
    description: string;
    websiteUrl: string;
  }) => BlogDocument;
};

export type BlogModelType = Model<BlogDocument> & BlogModelStaticType;
