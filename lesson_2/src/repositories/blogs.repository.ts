import { LocalDB } from "../db/db";
import { Blog, BlogWithId, Database } from "../types";

export class BlogsRepository {
  db: LocalDB;

  constructor() {
    this.db = new LocalDB();
  }

  addBlog(blog: Blog) {
    const newBlog: BlogWithId = {
      ...blog,
      id: String(Math.round(Math.random() * 1000)),
    };

    this.db.addBlog(newBlog);

    return newBlog;
  }

  getAllBlogs() {
    return this.db.getAllBlogs();
  }

  getBlogById(id: BlogWithId["id"]) {
    const found = this.db.getAllBlogs().find((blog) => blog.id === id);

    return found ?? null;
  }

  updateBlogById(id: BlogWithId["id"], props: Partial<Blog>) {
    let found = this.getBlogById(id);
    const index = this.getAllBlogs().findIndex((blog) => blog.id === id);

    if (!found) {
      return null;
    }

    const updatedBlog = { ...found, ...props };
    this.db.updateBlogByIndex(index, updatedBlog);

    return true;
  }

  deleteBlogById(id: BlogWithId["id"]) {
    const foundIdx = this.db.getAllBlogs().findIndex((blog) => blog.id === id);

    if (foundIdx < 0) {
      return null;
    }

    this.db.deleteBlogById(id);

    return true;
  }

  clearBlogs() {
    this.db.clearBlogs();

    return this;
  }
}
