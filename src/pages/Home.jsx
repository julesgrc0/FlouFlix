import React from "react";
import { Avatar, Box, Flex, Heading } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import { Capacitor } from "@capacitor/core";
import { Toast } from "@capacitor/toast";
import { Network } from '@capacitor/network';
import { FlouFlix } from '../plugin/index';
import { storage } from "../storage";
import { isUrlValid, parseFile } from "../utility";

import { ContentCards } from './components/ContentCards';
import { DrawerAddCard } from "./components/DrawerAddCard";
import { DrawerAddSerieItem } from "./components/DrawerAddSerieItem";
import { TopBar } from './components/TopBar';
import { useNavigate } from "react-router-dom";



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

        FlouFlix.addListener("onPlayLast", (evt) => {
            (async () => {
                const obj = await FlouFlix.getData();
                if (obj.value == null) {
                    return;
                }
                const data = JSON.parse(obj.value);
                if (data.last_index < 0) {
                    navigate("/video/" + data.last_id);
                } else {
                    navigate("/video/" + data.last_id + "?index=" + data.last_index);
                }

            })()
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
            (async () => {
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
            })();
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
