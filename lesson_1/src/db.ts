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

  constructor(initialDB: VIDEO[] = []) {
    this.db = initialDB;
  }

  getAllVideos() {
    return this.db;
  }

  addVideo(video: VIDEO) {
    this.db.push(video);

    return new LocalDB(this.db);
  }

  deleteVideo(id: VIDEO["id"]) {
    const updatedDb = this.db.filter(({ id: videoId }) => videoId !== id);

    return new LocalDB(updatedDb);
  }

  getVideoById(id: VIDEO["id"]) {
    return this._findVideoByKeyValue("id", id);
  }

  updateVideoById(id: VIDEO["id"], updatedFields: VIDEO) {
    const found = this._findVideoByKeyValue("id", id);

    const updatedVideo = { ...found, ...updatedFields };

    //TODO: Сгенерировать новый массив с обновленным видео
  }

  private _findVideoByKeyValue<K extends keyof VIDEO>(key: K, value: VIDEO[K]) {
    return this.db.find((video) => video[key] === value);
  }
}
