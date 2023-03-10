import { Preferences } from "@capacitor/preferences";
import { grabbeVideoFromUrl, searchApiMovies } from './utility';

interface StorageItemData {
  title: string;
  date: string;
  update: string;
  video: {
    url: string;
    referer: string;
  };
}

interface StorageItem {
  id: string;
  data: StorageItemData;

  overview: string;
  image_uri: string;

  is_movie: boolean;
  list: StorageItemData[];
}

class Storage {
  constructor() {}

  private genKey(): string {
    return Math.random().toString(16).slice(2) + "-" + new Date().getTime();
  }

  public async createMovieItem(
    title: string,
    referer: string
  ): Promise<StorageItem> {
    const api = await searchApiMovies(title, "movie");
    return {
      id: this.genKey(),
      data: await this.createItem(title, referer),
      overview: api.overview,
      image_uri: api.image,

      is_movie: true,
      list: [],
    };
  }

  public async createSerieItem(title: string): Promise<StorageItem> {
    const api = await searchApiMovies(title, "serie");

    return {
      id: this.genKey(),
      data: await this.createItem(title, "", false),
      overview: api.overview,
      image_uri: api.image,
      is_movie: false,
      list: [],
    };
  }

  public async getAll(): Promise<StorageItem[]> {
    const data = await Preferences.keys();
    const items: (StorageItem | null)[] = await Promise.all( data.keys.map(async (key) => this.get(key)));
    
    return (
      items.filter(
        (item) => item !== null && item !== undefined
      ) as StorageItem[]
    ).sort(
      (a, b) =>
        new Date(b.data.update).getTime() - new Date(a.data.update).getTime()
    );
  }

  public async get(key: string): Promise<StorageItem | null> {
    return new Promise((res, rej) => {
      Preferences.get({ key })
        .then(({ value }) => {
          if (value != null) {
            res(JSON.parse(value));
          } else {
            this.remove(key);
            res(null);
          }
        })
        .catch((err) => {
          this.remove(key);
          res(null);
        });
    });
  }

  async remove(key: string): Promise<void> {
    return await Preferences.remove({ key });
  }

  async set(key: string, value: StorageItem): Promise<void> {
    return await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  }

  public async createItem(
    title: string,
    referer: string,
    message: boolean = true
  ): Promise<StorageItemData> {
    const dt = new Date();
    return {
      video: await grabbeVideoFromUrl(referer, message),
      title,
      date: dt.toLocaleDateString("fr"),
      update: dt.toISOString(),
    };
  }

  async addSerieItem(key: string, item: StorageItemData): Promise<void> {
    let serie = await this.get(key);
    if (serie != null) {
      serie.list.push(item);
      await this.set(key, serie);
    }
  }

  async removeSerieItem(key: string, index: number): Promise<void> {
    let serie = await this.get(key);
    if (serie != null) {
      if (index >= serie.list.length || index < 0) {
        return;
      }
      serie.list.splice(index, 1);
      await this.set(key, serie);
    }
  }

  async editSerieItem(
    key: string,
    index: number,
    item: StorageItemData
  ): Promise<void> {
    let serie = await this.get(key);
    if (serie != null) {
      if (index >= serie.list.length || index <= 0) {
        return;
      }
      serie.list[index] = item;
      await this.set(key, serie);
    }
  }
}

export const storage = new Storage();
