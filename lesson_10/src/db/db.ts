import { MongoClient } from "mongodb";
import { SETTINGS } from "../constants";
import mongoose from "mongoose";

export const client = new MongoClient(SETTINGS.MONGO_URL);

const mongoUrl = SETTINGS.MONGO_URL + SETTINGS.DB_NAME;
export const runDb = async () => {
  try {
    await mongoose.connect(mongoUrl);
  } catch (e) {
    await mongoose.disconnect();
  }
};
