import { ERRORS, schema, validKeys } from "./constants";
import { VIDEO, ValueOf } from "./types";

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
    const { isError, errorsMessages } = this._validateAddVideo(video);

    if (isError) {
      return { isError, errorsMessages };
    }

    this.db.push({ ...video, id: Math.round(Math.random() * 1000) });

    return new LocalDB(this.db);
  }

  deleteVideo(id: VIDEO["id"]) {
    const updatedDb = this.db.filter(({ id: videoId }) => videoId !== id);

    return new LocalDB(updatedDb);
  }

  getVideoById(id: VIDEO["id"]) {
    return this._findVideoByKeyValue("id", id);
  }

  clearDb() {
    this.db = [];

    return new LocalDB(this.db);
  }

  updateVideoById(id: VIDEO["id"], updatedFields: VIDEO) {
    const found = this._findVideoByKeyValue("id", id);

    if (!found) {
      return { isError: true };
    }

    const { isError, errorsMessages } = this._validateAddVideo(found);

    if (isError) {
      return { isError, errorsMessages };
    }

    const updatedVideo = { ...found, ...updatedFields };
    const idx = this.db.findIndex((video) => video.id === id);
    const newVideos = [...this.db.slice(0, idx), ...this.db.slice(idx + 1)];

    newVideos.push(updatedVideo);

    this.db = newVideos;

    return new LocalDB(newVideos);
  }

  private _findVideoByKeyValue<K extends keyof VIDEO>(key: K, value: VIDEO[K]) {
    return this.db.find((video) => video[key] === value);
  }

  private _validateAddVideo(video: VIDEO) {
    const entries = Object.entries(video) as [keyof VIDEO, ValueOf<VIDEO>][];

    let isError = false;
    const errors = [];

    /** Проверяем что все значения удовлетворяют VIDEO */
    for (let i = 0; i < entries.length; i++) {
      const [key, val] = entries[i];

      if (!schema[key](val)) {
        isError = true;
        errors.push({ message: ERRORS.WRONG_VALUE, field: key });
      }
    }

    return { isError, errorsMessages: errors };
  }
}
