import { MongoClient } from "mongodb";
import { BlogsRepository } from "../repositories/blogs.repository";
import { PostsRepository } from "../repositories/posts.repository";

const local = "mongodb://localhost:27017";
const remote =
  "mongodb+srv://dreamonaut:vgfo102jKWUp4Ekb@cluster0.4wf0ecu.mongodb.net/?retryWrites=true&w=majority";

export const client = new MongoClient(remote);

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
