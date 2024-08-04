import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class Post {
  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  blogId: string;

  @Prop()
  blogName: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: Object, required: false })
  extendedLikesInfo: Record<any, any>;

  static createPost({ title, shortDescription, content, blogId, blogName }) {
    const post = new this();

    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = blogId;
    post.blogName = blogName;
    post.createdAt = new Date();
    post.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };

    return post;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

type PostModelStaticType = {
  createPost: ({
    title,
    shortDescription,
    content,
    blogId,
    blogName,
  }: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
  }) => PostDocument;
};

export type PostModelType = Model<PostDocument> & PostModelStaticType;
