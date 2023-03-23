import React from "react";
import { Box } from "@chakra-ui/react";
import { FlouFlix } from '../plugin/index';
import { useNetwork } from '../hooks/useNetwork';
import { storage } from '../api/storage';
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";

import CardItem from "./CardItem";


export default function ScrollCards({
  setShowBorder,
  setCardOpen,
  setCreateOpen,

  setSelectedCard,
  showBorder,
  isCardOpen,
  isCreateOpen,

}) {
  const { connected } = useNetwork();
  const [items, setItems] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (connected) {
      storage.getItems().then((items) => setItems(items))
    } else {
      setItems([]);
    }
    if (Capacitor.isPluginAvailable("StatusBar")) {
      StatusBar.setBackgroundColor({
        color: "#141414",
      });
      StatusBar.show();
    }
    if (Capacitor.isPluginAvailable("NavigationBar")) {
      NavigationBar.setColor({
        color: "#141414",
        darkButtons: false,
      });

      NavigationBar.show();
    }


    FlouFlix.addListener("onTextDataShared", (data) => {
      setCreateOpen(false);
      if (data.text != null) {
        storage.extractVideo(data.text).then(async video => {
          const referer = data.text;

          await storage.createItem({
            title: referer,
            videos: [storage.createVideoItem(referer, video, referer)]
          })
          storage.getItems().then((items) => setItems(items))
        }).catch(() => { })
      } else if (data.file != null) {
        storage.parseFile(data.file.split("\n")).then(() => {
          storage.getItems().then((items) => setItems(items))
        }).catch(() => { })
      }
    })

    FlouFlix.addListener("onPlay", (state) => {
      setCreateOpen(false);
      if (state.url != null) {
        navigate(state.url);
      }
    })
    FlouFlix.addListener("onReadyCreate", (evt) => {
      setCreateOpen(true);
    })

    return () => {
      FlouFlix.removeAllListeners();
    };
  }, [connected, isCreateOpen, isCardOpen])

  return (
    <Box
      w="100%"
      h="calc(100% - 86px)"
      pos={"absolute"}
      bg={"#141414"}
      overflowY="auto"
      overflowX={"hidden"}
      onScroll={(evt) => {
        if (showBorder && evt.target.scrollTop < 20) {
          setShowBorder(false);
        } else if (!showBorder && evt.target.scrollTop >= 20) {
          setShowBorder(true);
        }
      }}
    >
      <React.Suspense>
        {items.map((it, index) => (
          <CardItem
            key={index}
            item={it}
            openCard={() => {
              setSelectedCard(it);
              setCardOpen(true);
            }}
          />
        ))}
      </React.Suspense>

      <Box w="100%" h="40px"></Box>
    </Box>
  );
}
