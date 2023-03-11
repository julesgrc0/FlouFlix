import React from "react";
import { useNavigate } from "react-router-dom";

import { Box } from "@chakra-ui/react";

import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import { Network } from '@capacitor/network';

import { FlouFlix } from '../plugin/index';

import { isUrlResponding, isUrlValid, parseFile, runAsync } from "./components/api/utility";
import { storage } from "./components/api/storage";

import { TopBar } from './components/TopBar';
import { DrawerAddCard } from "./components/drawer/DrawerAddCard";
import { DrawerAddSerieItem } from './components/drawer/DrawerAddSerieItem';
import { ContentCards } from './components/card/ContentCards';




export default function Home() {
    const [items, setItems] = React.useState([]);
    const [ready, setReady] = React.useState(false);
    const [connected, setConnected] = React.useState(true);

    const [drawerNewCard, setDrawerNewCardOpen] = React.useState(false);
    const [drawerSerieAdd, setDrawerSerieAddOpen] = React.useState(false);
    const [selectedSerie, setSelectedSerie] = React.useState(null);
    const navigate = useNavigate();


    React.useEffect(() => {
        storage.getAll().then((values) => {
            setItems(values);
            setReady(true);
        });

        if (Capacitor.isPluginAvailable("StatusBar")) {
            StatusBar.setBackgroundColor({
                color: "#161616",
            });
            StatusBar.show();
        }
        if (Capacitor.isPluginAvailable("NavigationBar")) {
            NavigationBar.setColor({
                color: "#161616",
                darkButtons: false,
            });

            NavigationBar.show();
        }

        FlouFlix.addListener("onTextDataShared", (evt) => {
            if (evt.text != null) {
                if (isUrlValid(evt.text)) {
                    onCreateNewCard(evt.text, "movie", evt.text);
                } else {
                    Toast.show({
                        text: "URL non valide !",
                    });
                }
            } else if (evt.file != null) {
                Toast.show({
                    text: "Chargement du fichier...",
                });
                let lines = evt.file.split("\n");
                parseFile(lines).then((newIts) => {
                    if (newIts.length != 0) {
                        Toast.show({
                            text:
                                newIts.length == 1
                                    ? "1 nouvelle video ! "
                                    : newIts.length + " nouvelles vidéos !",
                        });
                        newIts.forEach((item) => {
                            onCreateNewCard(
                                item.title,
                                item.type,
                                item.type == "movie" && item.list.length > 0
                                    ? item.list[0].video.url
                                    : "",
                                item.list
                            );
                        });
                    }
                });
            }
        });

        FlouFlix.addListener("onReadyCreate", (evt) => {
            setDrawerNewCardOpen(true);
        })

        const playVideo = (selid, selindex) =>{
            runAsync(async () => {
                const obj = await FlouFlix.getData();
                if (obj.value == null) {
                    return;
                }
                
                const data = JSON.parse(obj.value);
                if (data[selid] === undefined)
                {
                    return;
                }

                const item = await storage.get(data[selid]);
                if(item == null)
                {
                    return;
                }

                if (item.is_movie) {
                    const state = await isUrlResponding(item.data.video.url, item.data.video.referer)
                    if (state) {
                        navigate("/video/" + data[selid]);
                    } else {
                        Toast.show({
                            text: "Il semble que cette video n'existe pas..."
                        })
                    }
                } else if (data[selindex] < item.list.length) {
                    const state = await isUrlResponding(item.list[data[selindex]].video.url, item.list[data[selindex]].video.referer)
                    if (state) {
                        navigate("/video/" + data[selid] + "?index=" + data[selindex]);
                    } else {
                        Toast.show({
                            text: "Il semble que cette video n'existe pas..."
                        })
                    }
                }

            }) 
        }


        FlouFlix.addListener("onPlayNext", (evt) => {
            playVideo('next_id', 'next_index')
        })

        FlouFlix.addListener("onPlayLast", (evt) => {
            playVideo('last_id','last_index')
        })

        Network.addListener('networkStatusChange', (status) => {
            if (status.connected) {
                storage.getAll().then((values) => {
                    setItems(values);
                    setConnected(true);
                });
            } else {
                setItems([]);
                setConnected(false);
            }
        });

        return () => {
            FlouFlix.removeAllListeners();
            Network.removeAllListeners();
        };
    }, []);

    const onCreateNewCard = React.useCallback(
        (title, type, url = "", list = []) => {
            runAsync(async () => {
                if (type == "movie") {
                    const item = await storage.createMovieItem(title, url)
                    await storage.set(item.id, item);
                } else {
                    const item = await storage.createSerieItem(title)
                    item.list = list;
                    await storage.set(item.id, item);
                }
                const values = await storage.getAll();
                setItems(values);
            });
        }, [setItems]);

    const setSerieDrawerOpen = React.useCallback(
        (state) => {
            setDrawerSerieAddOpen(state);
            if (!state) {
                setSelectedSerie(null);
            }
        },
        [setDrawerSerieAddOpen, setSelectedSerie]);

    return (
        <>
            <Box h="100vh" bg="#161616" overflow={"hidden"}>
                <TopBar setDrawerOpen={setDrawerNewCardOpen} drawerOpen={drawerNewCard} />
                {ready && <ContentCards
                    items={items}
                    setItems={setItems}

                    connected={connected}

                    setSelectedSerie={setSelectedSerie}
                    setSerieOpen={setDrawerSerieAddOpen}
                />}

                {connected && <>

                    <DrawerAddCard isOpen={drawerNewCard} setOpen={setDrawerNewCardOpen} onCreate={onCreateNewCard} />
                    {selectedSerie != null && <DrawerAddSerieItem
                        selected={selectedSerie}
                        isOpen={drawerSerieAdd}
                        setOpen={setSerieDrawerOpen}
                        setItems={setItems}
                    />}
                </>}
            </Box>
        </>
    );
}
