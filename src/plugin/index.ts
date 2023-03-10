import { registerPlugin } from "@capacitor/core";

import type { FlouFlixPlugin } from "./definitions";

const FlouFlix = registerPlugin<FlouFlixPlugin>("FlouFlix", {
  web: () => import("./web").then((m) => new m.FlouFlixWeb()),
});

export * from "./definitions";
export { FlouFlix };