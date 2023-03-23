import React from "react";
import { Box } from "@chakra-ui/react";
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { ScreenOrientation, OrientationType } from '@capawesome/capacitor-screen-orientation';


import '../styles/Home.css';

import Loading from '../components/Loading'
import Topbar from '../components/Topbar';
import ScrollCards from '../components/ScrollCards'
import CardDrawer from '../components/CardDrawer'
import CreateDrawer from '../components/CreateDrawer'

export default function Home() {
    const [showBorder, setShowBorder] = React.useState<boolean>(false);
    const [isCardOpen, setCardOpen] = React.useState<boolean>(false);
    const [isCreateOpen, setCreateOpen] = React.useState<boolean>(false);
    const [selectedCard, setSelectedCard] = React.useState(undefined);
    

    return (
        <Box>
            <Topbar showBorder={showBorder} title="FlouFlix" icons={[
                {
                    icon: <SearchIcon boxSize={"5"} />,
                    click: () => { }
                },
                {
                    icon: <AddIcon boxSize={"5"} />,
                    click: () => {
                        setCreateOpen(true);
                    }
                }
            ]} />

            <React.Suspense fallback={<Loading />}>
                <ScrollCards
                    showBorder={showBorder}
                    isCardOpen={isCardOpen}
                    isCreateOpen={isCreateOpen}
                    setShowBorder={setShowBorder}
                    setCardOpen={setCardOpen}
                    setSelectedCard={setSelectedCard}
                    setCreateOpen={setCreateOpen}
                />

                <CardDrawer isCardOpen={isCardOpen} setCreateOpen={setCreateOpen} setCardOpen={setCardOpen} setSelectedCard={setSelectedCard} selectedCard={selectedCard} />
                <CreateDrawer isCreateOpen={isCreateOpen} setCreateOpen={setCreateOpen} setSelectedCard={setSelectedCard} selectedCard={selectedCard} />
            </React.Suspense>
        </Box>
    )
}