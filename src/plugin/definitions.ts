import type { PluginListenerHandle } from "@capacitor/core";

export interface FFTextDataSharedEvent {
  file: string | null;
  text: string | null;
}

export interface FFState {
  state: boolean
}

export interface FFData {
  last_id: string;
  last_title: string;
  last_index: number;
}

export interface FlouFlixPlugin {
  addListener(
    evt: "onTextDataShared",
    func: (event: FFTextDataSharedEvent) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  addListener(
    evt: "onReadyCreate" | "onPlayNext" | "onPlayLast",
    func: (event: FFState) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  getData(): Promise<string>;

  setData(value: string): Promise<void>;

  removeAllListeners(): Promise<void>;
}
