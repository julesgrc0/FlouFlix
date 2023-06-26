import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScaleFade } from "@chakra-ui/react";
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { storage } from "../api/storage";
import '../styles/Home.css';



const Topbar = React.lazy(() => import('../components/Topbar'));
const ScrollCards = React.lazy(() => import('../components/ScrollCards'));
const CardDrawer = React.lazy(() => import('../components/CardDrawer'));
const CreateDrawer = React.lazy(() => import('../components/CreateDrawer'));


export default function Home() {
    const { id } = useParams();
    const navigate = useNavigate()

    const [showBorder, setShowBorder] = React.useState<boolean>(false);
    const [isCardOpen, setCardOpen] = React.useState<boolean>(false);
    const [isCreateOpen, setCreateOpen] = React.useState<boolean>(false);
    const [selectedCard, setSelectedCard] = React.useState<any>(undefined);
    const [isFade, setIsFade] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsFade(true);
    }, []);

    React.useEffect(() => {

        if (id != undefined) {
            storage.get(id).then((item) => {
                if (item != null) {
                    setSelectedCard(item)
                    setCardOpen(true);
                }
            }).catch(() => { })
        }
    }, [id])

    return (
        <ScaleFade initialScale={0.5} in={isFade}>
            <React.Suspense>
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

                <ScrollCards
                    showBorder={showBorder}
                    isCardOpen={isCardOpen}
                    isCreateOpen={isCreateOpen}
                    setShowBorder={setShowBorder}
                    setCardOpen={setCardOpen}
                    setSelectedCard={setSelectedCard}
                    setCreateOpen={setCreateOpen}
                />

                <CardDrawer
                    isCardOpen={isCardOpen}
                    setCreateOpen={setCreateOpen}
                    setCardOpen={(value) => {
                        if (!value && id != undefined) {
                            navigate("/")
                        }
                        setCardOpen(value)
                    }}
                    setSelectedCard={setSelectedCard}
                    selectedCard={selectedCard} />

                <CreateDrawer
                    isCreateOpen={isCreateOpen}
                    setCreateOpen={setCreateOpen}
                    setSelectedCard={setSelectedCard}
                    selectedCard={selectedCard} />
            </React.Suspense>
        </ScaleFade>
    )
}