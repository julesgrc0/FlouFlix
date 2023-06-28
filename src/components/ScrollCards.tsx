import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";

import { FlouFlix } from "../plugin/index";

import { useNetwork } from "../hooks/useNetwork";
import { Item, storage } from "../api/storage";
import { ScrollCardsProps } from './types';

const CardItem = React.lazy(() => import("./CardItem"));


function SetupAndroidStatusBar() {
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
}


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
      storage.getItems().then((items) => setItems(items));
    } else {
      setItems([]);
    }


    FlouFlix.addListener("onTextDataShared", (data) => {
      setCreateOpen(false);
      if (data.text != null) {
        storage
          .extractVideo(data.text)
          .then(async (video) => {
            await storage.createItem({
              title: data.text,
              videos: [storage.createVideoItem(data.text ?? "", video)],
            });
            storage.getItems().then((items) => setItems(items));
          })
          .catch(() => { });
      } else if (data.file != null) {
        storage
          .parseFile(data.file)
          .then(() => storage.getItems().then((items) => setItems(items)))
          .catch(() => { });
      }
    });

    FlouFlix.addListener("onPlay", (state) => {
      setCreateOpen(false);
      if (state.url != null) {
        navigate(state.url);
      }
    });
    FlouFlix.addListener("onReadyCreate", (evt) => {
      setSelectedCard(undefined);
      setCardOpen(false);
      setCreateOpen(true);
    });

    return () => {
      FlouFlix.removeAllListeners();
    };
  }, [connected, isCreateOpen, isCardOpen]);

  const onScroll = React.useCallback((evt: any) => {
    if (showBorder && evt.target.scrollTop < 20) {
      setShowBorder(false);
    } else if (!showBorder && evt.target.scrollTop >= 20) {
      setShowBorder(true);
    }
  }, [showBorder, setShowBorder])

  const onOpenCard = React.useCallback((it: Item) => {
    setSelectedCard(it);
    setCardOpen(true);
  }, [setSelectedCard, setCardOpen]);

  return (
    <Box
      w="100%"
      h="calc(100% - 86px)"
      pos={"absolute"}
      bg={"#141414"}
      overflowY="auto"
      overflowX={"hidden"}
      onScroll={onScroll}
    >
      {connected && (
        <React.Suspense>
            {items.map((it, index) => (
              <CardItem
                key={index}
                delay={index < 5 ? index * 0.5 : 0}
                item={it}
                onCardClick={onOpenCard}
              />
            ))}
        </React.Suspense>
      )}
      {!connected && (
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "white",
            opacity: 0.6,
          }}
        >
          Pas de connection internet.
        </p>
      )}
      <Box w="100%" h="40px"></Box>
    </Box>
  );
};

export default ScrollCards;
