import { LocalDB } from "../db/db";
import { Post, PostWithId } from "../types";

export class PostsRepository {
  db: LocalDB;

  constructor(initDb: LocalDB) {
    this.db = initDb;
  }

  getAllPosts() {
    return this.db.getAllPosts();
  }

  addPost(post: Post) {
    const newPost: PostWithId = {
      ...post,
      id: String(Math.round(Math.random() * 1000)),
      blogName: this.db.getBlogById(post.blogId)?.name || "",
    };

    this.db.addPost(newPost);

    return newPost;
  }

  getPostById(id: PostWithId["id"]) {
    const found = this.db.getAllPosts().find((post) => post.id === id);

    return found ?? null;
  }

  updatePostById(id: PostWithId["id"], props: Partial<Post>) {
    let found = this.getPostById(id);
    const index = this.getAllPosts().findIndex((post) => post.id === id);

    if (!found) {
      return null;
    }

    const updatedPost = { ...found, ...props };
    this.db.updatePostByIndex(index, updatedPost);

    return true;
  }

  deletePostById(id: PostWithId["id"]) {
    const foundIdx = this.db.getAllPosts().findIndex((post) => post.id === id);

    if (foundIdx < 0) {
      return null;
    }

    this.db.deletePostById(id);

    return true;
  }

  clearPosts() {
    this.db.clearPosts();

    return this;
  }
}
