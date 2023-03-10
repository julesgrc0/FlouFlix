import { WebPlugin } from "@capacitor/core";
import type { FlouFlixPlugin } from "./definitions";

export class FlouFlixWeb extends WebPlugin implements FlouFlixPlugin {
  constructor() {
    super();
  }
}
