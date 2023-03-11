import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { App } from "@capacitor/app";
import { CapacitorVideoPlayer } from "capacitor-video-player";
import { Toast } from "@capacitor/toast";
import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';

import { FlouFlix } from "../plugin";
import { storage } from "./components/api/storage";
import { runAsync } from "./components/api/utility";

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
                    state: false,
                    error: undefined,
                    data: undefined
                });
            } else {
                
                callback({
                    state: true,
                    error: undefined,
                    data: player
                });
            }
        })
        .catch((err) => {

            callback({
                state: false,
                error: err,
                data: undefined
            });
        });
}


export default function Video() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();


    const init = React.useCallback(
        (id, title, video, smtitle = undefined) => {
            InitPlayer(id, title, video, (state) => {
                if (state.state == false) 
                {
                    exit("Nous n'avons pas réussi à lire la vidéo...");
                } else {
                    runAsync(async ()=>{
                        await StatusBar.hide();
                        await NavigationBar.hide();
                        await ScreenOrientation.lock({ type: OrientationType.LANDSCAPE });
                    }).catch(()=>{
                        exit("Nous n'avons pas réussi à lire la vidéo...");
                    })
                }
            }, smtitle);
        },
        []);

    const exit = React.useCallback((error = "") => {
        runAsync(async ()=>{
            if (error.length != 0) {
                await Toast.show({
                    text: error
                });
            }
            await ScreenOrientation.lock({ type: OrientationType.PORTRAIT })
            await CapacitorVideoPlayer.stopAllPlayers();
        }).then(()=>{
            navigate("/");
        })
    }, [navigate]);

    React.useEffect(() => {
        storage.get(id).then((value) => {
            if (location.search.startsWith("?index=")) {
                try {
                    let index = parseInt(location.search.replace("?index=", ""));
                    const video = value.list[index].video;
                   
                    if (video.url.length == 0) {
                        
                        exit("Il semble que cette video n'existe pas...");
                    } else {
                        let hasNext = index + 1 < value.list.length
                        
                        FlouFlix.setData({
                            value: JSON.stringify({
                                last_id: value.id,
                                last_title: value.list[index].title + " - " + value.data.title,
                                last_index: index,

                                next_id: hasNext ? value.id : "",
                                next_index: hasNext ? index + 1 : -1,
                                next_title: hasNext ? value.list[index + 1].title + " - " + value.data.title : ""
                            })
                        })
                        init(value.id, value.data.title, video, value.list[index].title);
                    }
                } catch {
                    exit("Nous n'avons pas réussi à lire la vidéo...");
                }
            } else {
                const video = value.video;
                
                if (video.url.length == 0) {
                    exit("Il semble que cette video n'existe pas...");
                } else {
                    let next = {}
                    FlouFlix.setData({
                        value: JSON.stringify({
                            last_id: value.id,
                            last_title: value.data.title,
                            last_index: -1,

                            next_id: "",
                            next_index: -1,
                            next_title: ""
                        })
                    })
                    init(value.id, value.data.title, video);
                }
            }
        });

        App.addListener("backButton", (event) => {
            exit();
        });
        
        App.addListener("pause", ()=>{
            CapacitorVideoPlayer.pause({
                playerId:id
            })
        })
        App.addListener("resume", () => {
            CapacitorVideoPlayer.play({
                playerId: id
            })
        })

        CapacitorVideoPlayer.addListener("jeepCapVideoPlayerExit", (evt) => {
            exit();
        });
        CapacitorVideoPlayer.addListener("jeepCapVideoPlayerEnded", (evt) => {
            exit();
        });

        return () => {
            App.removeAllListeners();
            CapacitorVideoPlayer.removeAllListeners();
        };
    }, []);

    return (
        <>
            <div
                id={id}
                slot="fixed"
                style={{
                    background: "#161616",
                    width: "100%",
                    height: "100vh",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
            ></div>
        </>
    );
}
