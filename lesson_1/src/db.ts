import { ERRORS, schema, validKeys } from "./constants";
import { RESOLUTION, VIDEO, ValueOf } from "./types";

export const generateRandomVideo = () => ({
  title: "Test",
  author: "Test",
  canBeDownloaded: true,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date().toISOString(),
  availableResolutions: ["P144"] as RESOLUTION[],
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

    const date = new Date();

    const videoWithDefaultParams = {
      minAgeRestriction: null,
      canBeDownloaded: false,
      createdAt: date.toISOString(),
      publicationDate: new Date(date.getTime() + +86400000).toISOString(),
      ...video,
      id: Math.round(Math.random() * 1000),
    };

    this.db.push(videoWithDefaultParams);

    return videoWithDefaultParams;
  }

  deleteVideo(id: VIDEO["id"]) {
    const updatedDb = this.db.filter(({ id: videoId }) => videoId !== id);

    this.db = updatedDb;

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

    const updatedVideo = { ...found, ...updatedFields };

    const { isError, errorsMessages } = this._validateAddVideo(updatedVideo);

    if (isError) {
      return { isError, errorsMessages };
    }

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

    return { isError, errorsMessages: errors.reverse() };
  }
}
