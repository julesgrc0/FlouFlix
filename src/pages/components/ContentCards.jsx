import React from "react";
import { Box, Center } from "@chakra-ui/react";

import { CardMovie } from "./CardMovie";
import { CardSerie } from "./CardSerie";

function NoContentCards({ connected }) {
    return (
        <Center mt="40px" color={"whiteAlpha.600"} padding={5}>
            {connected ? "Vous n'avez encore aucune vidéo, ajoutez-en appuyant sur \"+\"." : "Vous n'êtes pas connecté à Internet, vos vidéos s'afficheront quand vous serait en ligne."}
        </Center>
    );
}

export function ContentCards({ items, setItems, setSelectedSerie, setSerieOpen, connected }) {
    if(items.length == 0)
    {
        return <NoContentCards connected={connected} />
    }
    return (
        <Box h="calc(100% - 110px)" padding={"5px"} overflowY={"auto"}>
            <Box h={"40px"} />
            {items.map((item, index) => {
                if (item.is_movie) {
                    return <CardMovie item={item} key={index} setItems={setItems}  />;
                }

                return (
                    <CardSerie
                        key={index}    
                        item={item}
                        
                        setItems={setItems}
                        openDrawer={() => {
                            setSelectedSerie(item);
                            setSerieOpen(true);
                        }}
                    />
                );
            })}
            <Box h={"40px"} />
        </Box>
    );
}
