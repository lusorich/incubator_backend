import { MongoClient } from "mongodb";
import { BlogsRepository } from "../repositories/blogs.repository";
import { PostsRepository } from "../repositories/posts.repository";

export const client = new MongoClient("mongodb://localhost:27017");

export const blogsRepository = new BlogsRepository();
export const postsRepository = new PostsRepository();

export const runDb = async () => {
  try {
    await client.connect();
    await client.db("kamasutra").command({ ping: 1 });
  } catch (e) {
    client.close();
  }
};
