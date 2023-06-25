import React from "react";
import { Box } from "@chakra-ui/react";
import { FlouFlix } from '../plugin/index';
import { useNetwork } from '../hooks/useNetwork';
import { Item, storage } from '../api/storage';
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";

import CardItem from "./CardItem";

type ScrollCardsProps ={
  setShowBorder: (show: boolean) => void;
  setCardOpen: (open: boolean) => void;
  setCreateOpen: (open: boolean) => void;
  setSelectedCard: (item?: Item) => void;

  showBorder: boolean,
  isCardOpen: boolean,
  isCreateOpen: boolean,
};

const ScrollCards: React.FC<ScrollCardsProps> = ({
  setShowBorder,
  setCardOpen,
  setCreateOpen,
  setSelectedCard,

  showBorder,
  isCardOpen,
  isCreateOpen,

}) => {
  const { connected } = useNetwork();
  const [items, setItems] = React.useState<Item[]>([]);
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
      if (data.text != null)
      {
        storage.extractVideo(data.text).then(async video => {
          await storage.createItem({
            title: data.text,
            videos: [storage.createVideoItem(data.text ?? "", video)]
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
      setSelectedCard(undefined);
      setCardOpen(false);
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
      onScroll={(evt: any) => {
        if (showBorder && evt.target.scrollTop < 20) {
          setShowBorder(false);
        } else if (!showBorder && evt.target.scrollTop >= 20) {
          setShowBorder(true);
        }
      }}
    >
      <React.Fragment>
        {items.map((it, index) => (
          <CardItem
            key={index}
            delay={index < 5 ? index * 0.5 : 0}
            item={it}
            openCard={() => {
              setSelectedCard(it);
              setCardOpen(true);
            }}
          />
        ))}
      </React.Fragment>

      <Box w="100%" h="40px"></Box>
    </Box>
  );
}

export default  ScrollCards;