import { Collection, ObjectId, WithId } from "mongodb";
import {
  ERROR_MSG,
  MONGO_COLLECTIONS,
  MONGO_DB_NAME,
} from "../../../constants";
import { client } from "../../../db/db";

import { ResultObject } from "../../../common/helpers/result.helper";
import {
  COMMON_RESULT_STATUSES,
  Result,
} from "../../../common/types/common.types";
import { BlogInput, BlogWithId } from "../domain/blog.entity";
import { blogsQueryRepository } from "./blogs.query.repository";

export interface IBblogsCommandsRepository {
  addBlog: (newBlob: BlogWithId) => Promise<Result<BlogWithId>>;
  updateBlogById: (
    id: BlogWithId["id"],
    props: Partial<BlogInput>
  ) => Promise<Result<null>>;
  deleteBlogById: (id: BlogWithId["id"]) => Promise<Result<null>>;
  clearBlogs: () => Promise<this>;
}

export class BlogsCommandsRepository
  extends ResultObject
  implements IBblogsCommandsRepository
{
  coll: Collection<BlogWithId>;

  constructor() {
    super();
    this.coll = client.db(MONGO_DB_NAME).collection(MONGO_COLLECTIONS.BLOGS);
  }

  async addBlog(newBlog: BlogWithId) {
    await this.coll.insertOne(newBlog);

    return this.getResult<BlogWithId>({
      status: COMMON_RESULT_STATUSES.SUCCESS,
      data: blogsQueryRepository._mapToBlogViewModel(
        newBlog as WithId<BlogWithId>
      ) as BlogWithId,
    });
  }

  async updateBlogById(id: BlogWithId["id"], props: Partial<BlogInput>) {
    let found = await this.coll.updateOne({ id }, { $set: { ...props } });

    if (!found.matchedCount) {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
        errorMessage: ERROR_MSG[2],
      });
    }

    return this.getResult({
      data: null,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  async deleteBlogById(id: BlogWithId["id"]) {
    const found = await this.coll.deleteOne({ id });

    if (!found.deletedCount) {
      return this.getResult({
        data: null,
        status: COMMON_RESULT_STATUSES.NOT_FOUND,
        errorMessage: ERROR_MSG[2],
      });
    }

    return this.getResult({
      data: null,
      status: COMMON_RESULT_STATUSES.SUCCESS,
    });
  }

  async clearBlogs() {
    await this.coll.deleteMany({});

    return this;
  }
}

export const blogsCommandsRepository = new BlogsCommandsRepository();
