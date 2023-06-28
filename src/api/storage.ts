import { Preferences } from "@capacitor/preferences";
import { CapacitorHttp } from "@capacitor/core";
import { FlouFlix } from "../plugin/index";

export interface ItemVideoContent {
  url: string;
  image: string;
  referer: string;
  progress: number;
}

export interface ItemVideo {
  title: string;
  date: number;
  update: number;
  video: ItemVideoContent;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  is_movie: boolean;
  date: number;
  videos: ItemVideo[];
  last: number;
  next: number;
}


export type ApiResultItem = {
  image: string;
  description: string;
}


export function titleCase(str) {
  let sentence = str.toLowerCase().split(" ");
  for (let i = 0; i < sentence.length; i++) {
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }

  return sentence.join(" ");
}

class Storage {
  public constructor() { }

  public isDebug() {
    return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  }

  public async parseFile(fileData: string) {
    let lines: string[] = fileData.split("\n");
    let items: ItemVideo[] = [];
    let title: string = "";

    const addItem = async (line: string) => {
      let parts = line.split(":");
      if (parts.length < 2) {
        return
      }

      let ptitle = parts[0];
      let referer = line.replace(ptitle + ":", "");
      try {
        const videoContent = await this.extractVideo(referer);
        const item = this.createVideoItem("épisode " + (items.length + 1), videoContent);
        items.push(item);
      } catch { }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if ((line.startsWith("[") && line.endsWith("]")) || i == lines.length - 1) {
        await addItem(line);

        if (title.length != 0) {
          let apiRes: ApiResultItem = {description:"", image:""};
          try {
            apiRes = await this.apiSearchVideo(title, "tv")  
          } catch { 
            apiRes = { description: "", image: "" }; 
          }
          
          await this.createItem({
            title,
            description: apiRes.description,
            image: apiRes.image,
            videos: items
          })
        }

        items = []
        title = line.replace("[", "").replace("]", "");
      } else if (title.length != 0) {
        await addItem(line);
      }
    }
  }

  public async extractVideo(referer: string): Promise<ItemVideoContent> {
    if (this.isDebug()) {
      return new Promise((res) => setTimeout(() => res({
        url: "",
        referer,
        image: "",
        progress: 0
      }), 1000))
    }
    return new Promise((res, rej) => {
      CapacitorHttp.get({
        url: referer,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        readTimeout: 5000,
        connectTimeout: 5000,
      })
        .then((response) => {
          const MP4_regex = /\bhttps?:\/\/\S+\.mp4\b/;
          const MP4_urls = response.data.match(MP4_regex);

          const JPG_regex = /\bhttps?:\/\/\S+\.jpg\b/;
          const JPG_urls = response.data.match(JPG_regex);

          res({
            url: MP4_urls != null ? MP4_urls[0] : "",
            image: JPG_urls != null ? JPG_urls[0] : "",
            referer,
            progress: 0
          });
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  public async apiSearchVideo(title: string, type: "tv" | "movie"): Promise<ApiResultItem> {
    const API_KEY = "675eba7a24c6d06fa76bf002db96f803";
    return new Promise((res, rej) => {
      CapacitorHttp.get({
        url: `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&language=fr-FR&query=${title}`,
        responseType: "json",
      })
        .then(({ data }) => {
          const json = data;
          if (json.results && json.results.length > 0) {
            res({
              image:
                json.results[0].backdrop_path != null
                  ? "https://image.tmdb.org/t/p/w500" +
                  json.results[0].backdrop_path
                  : "",
              description:
                json.results[0].overview != null
                  ? json.results[0].overview
                  : "",
            });
          } else {
            rej()
          }
        })
        .catch(() => {
          rej()
        });
    });
  }

  public createVideoItem(title: string, videoContent: ItemVideoContent): ItemVideo {
    return {
      title,
      date: new Date().getTime(),
      update: new Date().getTime(),
      video: videoContent
    }
  }

  public async createItem(it: any) {
    let item: Item = {
      id: Math.random().toString(16).slice(2) + "-" + new Date().getTime(),
      title: "",
      description: "",
      image: "",
      date: new Date().getTime(),
      is_movie: false,
      videos: [],
      next: 0,
      last: 0,
      ...it,
    };
    return await this.set(item.id, item);
  }

  public async getItems(): Promise<Item[]> {
    const data = await Preferences.keys();
    const items: (Item | null)[] = await Promise.all(
      data.keys.map(async (key) => this.get(key))
    );

    return (
      items.filter((item) => item !== null && item !== undefined) as Item[]
    ).sort((a, b) => b.date - a.date);
  }

  public async get(key: string): Promise<Item | null> {
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

  async set(key: string, value: Item): Promise<void> {
    return await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  }

  async addVideo(key: string, video: ItemVideo): Promise<void> {
    let it = await this.get(key);
    if (it != null) {
      it.videos.push(video);
      return await this.set(key, it);
    }
  }

  async removeSerieItem(key: string, index: number): Promise<void> {
    let it = await this.get(key);
    if (it != null) {
      if (index >= it.videos.length || index < 0) {
        return;
      }
      it.videos.splice(index, 1);
      return await this.set(key, it);
    }
    let serie = await this.get(key);
    if (serie != null) {
    }
  }

  async editVideo(key: string, index: number, video: ItemVideo): Promise<void> {
    let it = await this.get(key);
    if (it != null) {
      if (index >= it.videos.length || index <= 0) {
        return;
      }
      it.videos[index] = video;
      await this.set(key, it);
    }
  }

  async setItemVideoState(key: string, index: number, duration: number, time: number) {
    let it = await this.get(key);
    if (it == null) {
      return;
    }

    if (index >= it.videos.length) {
      return;
    }
    it.videos[index].video.progress = time / duration;
    await storage.set(key, it);
  }

  async watchVideo(key: string, index: number = 0) {
    let it = await this.get(key);
    if (it == null) {
      return;
    }
    if (it.videos.length <= 0) {
      return;
    }

    if (it.videos.length == 1) {
      it.last = 0;
      it.next = 0;
      await FlouFlix.setData({
        next: "",
        nextTitle: "",

        last: `/video/${key}/${it.last}`,
        lastTitle: titleCase(it.title)
      });
      return await this.set(key, it);
    }

    it.last = index;
    if (index + 1 >= it.videos.length) {
      it.next = 0;
    } else {
      it.next = index + 1;
    }

    await FlouFlix.setData({
      next: `/video/${key}/${it.next}`,
      nextTitle: titleCase(it.videos[it.next].title),

      last: `/video/${key}/${it.last}`,
      lastTitle: titleCase(it.videos[it.last].title)
    });
    await this.set(key, it);
  }
}

export const storage = new Storage();
