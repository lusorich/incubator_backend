import { VIDEO } from "./types";

export const generateRandomVideo = () => ({
  id: Math.round(Math.random() * 1000),
  title: "Test",
  author: "Test",
  canBeDownloaded: true,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date().toISOString(),
  availableResolutions: ["P144"],
});

export class LocalDB {
  private db;

  constructor(db: VIDEO[] = []) {
    this.db = db;
  }

  getAllVideos() {
    return this.db;
  }

  addVideo(video: VIDEO) {
    this.db.push(video);

    return new LocalDB(this.db);
  }
}
