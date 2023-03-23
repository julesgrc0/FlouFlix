import React from "react";
import {  useNavigate, useParams } from "react-router-dom";

import { App } from "@capacitor/app";
import { CapacitorVideoPlayer } from "capacitor-video-player";
import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';
import { storage, titleCase } from "../api/storage";

function InitPlayer(id, title, video, callback, smtitle = undefined) {
    CapacitorVideoPlayer.initPlayer({
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

    const exit = React.useCallback(() => {
        (async () => {
            await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
            await CapacitorVideoPlayer.stopAllPlayers();
        })().then(() => {
            navigate("/");

            
        })
    }, [navigate]);

    const init = React.useCallback(
        (item, index) => {

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
        let iindex = parseInt(index)
        if (isNaN(iindex)) {
            return;
        }

        const duration = (await CapacitorVideoPlayer.getDuration({ playerId: id }));
        const time = (await CapacitorVideoPlayer.getCurrentTime({ playerId: id }));
        if (isNaN(duration.value) || isNaN(time.value)) {
            return;
        }
        await storage.setItemVideoState(id, iindex, duration.value, time.value)
    }, [])

    React.useEffect(() => {
        storage.get(id).then((item) => {
            let iindex = parseInt(index);
            if (item != null && !isNaN(iindex) && iindex < item.videos.length) {
                storage.watchVideo(id, iindex).then(() => {
                    init(item, iindex)
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

            CapacitorVideoPlayer.pause({
                playerId: id
            })
            saveVideoState()
        })
        App.addListener("resume", () => {
            CapacitorVideoPlayer.play({
                playerId: id
            })
        })


        CapacitorVideoPlayer.addListener("jeepCapVideoPlayerPlay", () => {
            saveVideoState()
        })
        CapacitorVideoPlayer.addListener("jeepCapVideoPlayerPause", () => {
            saveVideoState()
        })

        CapacitorVideoPlayer.addListener("jeepCapVideoPlayerExit", (evt) => {
            saveVideoState()
            exit();
        });
        CapacitorVideoPlayer.addListener("jeepCapVideoPlayerEnded", (evt) => {
            saveVideoState()
            exit();
        });


        return () => {
            App.removeAllListeners();
            CapacitorVideoPlayer.removeAllListeners();
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
