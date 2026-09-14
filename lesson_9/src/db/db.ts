import { MongoClient } from "mongodb";
import { SETTINGS } from "../constants";

export const client = new MongoClient(SETTINGS.MONGO_URL);

export const runDb = async () => {
  try {
    await client.connect();
    await client.db(SETTINGS.DB_NAME).command({ ping: 1 });
  } catch (e) {
    client.close();
  }
};
