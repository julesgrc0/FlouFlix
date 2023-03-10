import { WebPlugin } from "@capacitor/core";
import type { FlouFlixPlugin } from "./definitions";

export class FlouFlixWeb extends WebPlugin implements FlouFlixPlugin {
  constructor() {
    super();
  }

  getData(): Promise<string> {
      return new Promise((res, rej)=>{
        res("")
      })
  }

  setData(obj: string): Promise<void> {
      return new Promise((res, rej)=>{
        rej();
      })
  }
}
