import { MongoClient } from "mongodb";
import { BlogsRepository } from "../repositories/blogs.repository";
import { PostsRepository } from "../repositories/posts.repository";
import * as dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "";
const DB_NAME = process.env.DB_NAME || "";

export const client = new MongoClient(MONGO_URL);

export const blogsRepository = new BlogsRepository();
export const postsRepository = new PostsRepository();

export const runDb = async () => {
  try {
    await client.connect();
    await client.db(DB_NAME).command({ ping: 1 });
  } catch (e) {
    client.close();
  }
};
