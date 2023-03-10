import type { PluginListenerHandle } from "@capacitor/core";

export interface FlouFlixAddEvent {
    file: string | null,
    text: string | null
}

export interface FlouFlixPlugin {
  addListener(
    eventName: "add",
    listenerFunc: (event: FlouFlixAddEvent) => void
  ): Promise<PluginListenerHandle> & PluginListenerHandle;

  removeAllListeners(): Promise<void>;
}
