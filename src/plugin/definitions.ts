import type { PluginListenerHandle } from "@capacitor/core";

export interface FFTextDataSharedEvent {
  file: string | null;
  text: string | null;
}

export interface FFState {
  state: boolean,
  url: string | null
}

export interface FlouFlixPlugin {
  addListener(
    evt: "onTextDataShared",
    func: (event: FFTextDataSharedEvent) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  addListener(
    evt: "onReadyCreate" | "onPlay",
    func: (event: FFState) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  /**
   @function setData
   @param data
   @description 
   
   JSON -> string
   {
     next: "video url/...id/...index"
     last: ...
     nextTitle: "",
     lastTitle: ""
   }
   */
  setData(data: object): Promise<void>;

  removeAllListeners(): Promise<void>;
}
