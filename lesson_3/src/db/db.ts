import { BlogWithId, Database, Post, PostWithId } from "../types";

let instance: Database | null = null;

export class LocalDB {
  private db: Database;

  constructor() {
    if (!instance) {
      this.db = {
        blogs: [],
        posts: [],
      };
      instance = this.db;
    } else {
      this.db = instance;
    }
  }

  getAllBlogs() {
    return this.db.blogs;
  }

  getAllPosts() {
    return this.db.posts;
  }

  getBlogById(id: BlogWithId["id"]) {
    return this.db.blogs.find((blog) => blog.id === id);
  }

  getPostById(id: PostWithId["id"]) {
    return this.db.posts.find((blog) => blog.id === id);
  }

  addBlog(blog: BlogWithId) {
    this.db.blogs.push(blog);

    return this;
  }

  addPost(post: PostWithId) {
    this.db.posts.push(post);

    return this;
  }

  updateBlogByIndex(index: number, updatedBlog: BlogWithId) {
    this.db.blogs[index] = { ...updatedBlog };

    return this;
  }

  updatePostByIndex(index: number, updatedPost: PostWithId) {
    this.db.posts[index] = { ...updatedPost };

    return this;
  }

  deleteBlogById(id: BlogWithId["id"]) {
    const updatedDb = this.db.blogs.filter((blog) => blog.id !== id);

    this.db.blogs = updatedDb;

    return this;
  }

  deletePostById(id: PostWithId["id"]) {
    const updatedDb = this.db.posts.filter((blog) => blog.id !== id);

    this.db.posts = updatedDb;

    return this;
  }

  clearBlogs() {
    this.db.blogs = [];

    return this;
  }

  clearPosts() {
    this.db.posts = [];

    return this;
  }
}

export const db = new LocalDB();
