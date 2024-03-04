import { Collection, ObjectId, WithId } from "mongodb";
import { MONGO_COLLECTIONS, MONGO_DB_NAME } from "../../constants";
import { client } from "../../db/db";
import { BlogInput, BlogWithId } from "../../types";
import { blogsQueryRepository } from "../query/blogs.query.repository";

export interface IBblogsCommandsRepository {
  addBlog: (newBlob: BlogWithId) => Promise<BlogWithId | null>;
  updateBlogById: (
    id: BlogWithId["id"],
    props: Partial<BlogInput>
  ) => Promise<boolean>;
  deleteBlogById: (id: BlogWithId["id"]) => Promise<boolean>;
  clearBlogs: () => Promise<this>;
}

export class BlogsCommandsRepository implements IBblogsCommandsRepository {
  coll: Collection<BlogWithId>;

  constructor() {
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.BLOGS);
  }

  async addBlog(newBlog: BlogWithId) {
    await this.coll.insertOne(newBlog);

    return blogsQueryRepository._mapToBlogViewModel(
      newBlog as WithId<BlogWithId>
    );
  }

  async updateBlogById(id: BlogWithId["id"], props: Partial<BlogInput>) {
    let found = await this.coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...props } }
    );

    if (!found.matchedCount) {
      return false;
    }

    return true;
  }

  async deleteBlogById(id: BlogWithId["id"]) {
    const found = await this.coll.deleteOne({ _id: new ObjectId(id) });

    if (!found.deletedCount) {
      return false;
    }

    return true;
  }

  async clearBlogs() {
    await this.coll.deleteMany({});

    return this;
  }
}

export const blogsCommandsRepository = new BlogsCommandsRepository();
