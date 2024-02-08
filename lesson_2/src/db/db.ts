import { BlogWithId, Database } from "../types";

let instance: Database | null = null;

export class LocalDB {
  private db: Database;

  constructor() {
    if (!instance) {
      this.db = {
        blogs: [],
      };
      instance = this.db;
    } else {
      this.db = instance;
    }
  }

  getAllBlogs() {
    return this.db.blogs;
  }

  addBlog(blog: BlogWithId) {
    this.db.blogs.push(blog);

    return this;
  }

  updateBlogByIndex(index: number, updatedBlog: BlogWithId) {
    this.db.blogs[index] = { ...updatedBlog };

    return this;
  }

  deleteBlogById(id: BlogWithId["id"]) {
    const updatedDb = this.db.blogs.filter((blog) => blog.id !== id);

    this.db.blogs = updatedDb;

    return this;
  }

  clearBlogs() {
    this.db.blogs = [];

    return this;
  }
}
