import mongoose, { Model, model } from "mongoose";

export interface RateRequest {
  ip: string;
  url: string;
  date: Date | string;
}

type RequestModel = Model<RateRequest>;

const requestSchema = new mongoose.Schema<RateRequest>({
  date: {
    type: Date,
  },
  ip: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export const RequestModel = model<RateRequest, RequestModel>(
  "Request",
  requestSchema
);
export type RequestDocument = mongoose.HydratedDocument<RateRequest>;
