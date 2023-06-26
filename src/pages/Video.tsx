import React from "react";
import {  useNavigate, useParams } from "react-router-dom";

import { App } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';

import { CapacitorVideoPlayer as player } from "capacitor-video-player";
import { Item, ItemVideoContent, storage, titleCase } from "../api/storage";

const VideoPlayerPlugin: any = player;

function InitPlayer(id: string, title: string, video: ItemVideoContent, callback, smtitle = "") {
    VideoPlayerPlugin.initPlayer({
        mode: "fullscreen",
        url: video.url,
        headers: {
            "Referer": video.referer,
        },
        exitOnEnd: true,
        pipEnabled: true,
        chromecast: true,
        title: title,
        smallTitle: smtitle,
        playerId: id,
        componentTag: "div",

    })
        .then((player) => {
            if (!player.result) {
                callback({
                    error: undefined,
                    data: undefined
                });
            } else {

                callback({
                    error: undefined,
                    data: player
                });
            }
        })
        .catch((err) => {

            callback({
                error: err,
                data: undefined
            });
        });
}

export default function Video() {
    const { id, index } = useParams();
    const navigate = useNavigate();

    const itemId = id ?? "";
    const itemIndex = parseInt(index ?? "");

    const exit = React.useCallback(() => {
        (async () => {
            await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
            await VideoPlayerPlugin.stopAllPlayers();
        })().then(() => {
            navigate("/"+id);
        })
    }, [navigate]);

    const init = React.useCallback(
        (item: Item, index: number) => {

            InitPlayer(
                item.id,
                titleCase(item.title),
                item.videos[index].video, (state) => {
                    if (state.data == undefined || state.error != undefined) {
                        exit();
                    } else {
                        try {
                            StatusBar.hide();
                            NavigationBar.hide();
                            ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });
                        } catch { }

                    }
                }, item.is_movie ? "film" : item.videos[index].title);
        },
        [exit]);

    const saveVideoState = React.useCallback(async () => {
        if (isNaN(itemIndex)) {
            return;
        }

        const duration = (await VideoPlayerPlugin.getDuration({ playerId: id }));
        const time = (await VideoPlayerPlugin.getCurrentTime({ playerId: id }));
        if (isNaN(duration.value) || isNaN(time.value)) {
            return;
        }
        await storage.setItemVideoState(id ?? "", itemIndex, duration.value, time.value)
    }, [])

    React.useEffect(() => {
        storage.get(id ?? "").then((item) => {
            if (item != null && !isNaN(itemIndex) && itemIndex < item.videos.length) {
                storage.watchVideo(itemId, itemIndex).then(() => {
                    init(item, itemIndex)
                }).catch(() => {
                    exit();
                })
            } else {
                exit();
            }
        })

        App.addListener("backButton", (event) => {
            saveVideoState()
            exit();
        });

        App.addListener("pause", () => {

            VideoPlayerPlugin.pause({
                playerId: id
            })
            saveVideoState()
        })
        App.addListener("resume", () => {
            VideoPlayerPlugin.play({
                playerId: id
            })
        })


        VideoPlayerPlugin.addListener("jeepCapVideoPlayerPlay", () => {
            saveVideoState()
        })
        VideoPlayerPlugin.addListener("jeepCapVideoPlayerPause", () => {
            saveVideoState()
        })

        VideoPlayerPlugin.addListener("jeepCapVideoPlayerExit", (evt) => {
            saveVideoState()
            exit();
        });
        VideoPlayerPlugin.addListener("jeepCapVideoPlayerEnded", (evt) => {
            saveVideoState()
            exit();
        });


        return () => {
            App.removeAllListeners();
            VideoPlayerPlugin.removeAllListeners();
        };
    }, []);

    return (<div
        id={id}
        slot="fixed"
        style={{
            background: "#141414",
            width: "100%",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0,
        }}
    ></div>);
}
