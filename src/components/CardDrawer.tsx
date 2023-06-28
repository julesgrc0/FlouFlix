import React from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    Image,
    Text,
    Heading,
    Button,
    Flex,
    Modal,
    ModalContent,
    ModalOverlay,
    IconButton,
    HStack,
    Box,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { Item, storage } from "../api/storage";
import { DeleteModal } from "./modal/DeleteModal";
import { PlayIcon, EditIcon, DeleteIcon } from "./Icons";
import { CardDrawerProps } from './types';


const Topbar = React.lazy(() => import('./Topbar'));

const CardDrawer: React.FC<CardDrawerProps> = ({
    setSelectedCard,
    selectedCard,
    isCardOpen,
    setCardOpen,
    setCreateOpen,
}) => {
    const [isOpenDelete, setIsOpenDelete] = React.useState(false);
    const navigate = useNavigate();

    const item: Item = {
        id: "0",
        title: "",
        description: "",
        image: "",
        date: new Date().getTime(),
        is_movie: true,
        videos: [],
        last: 0,
        next: 0,
        ...selectedCard,
    };

    const date = new Date(item.date);
    const dateStr =
        " le " +
        date.toLocaleDateString("fr", { day: "2-digit", month: "2-digit" }) +
        " à " +
        date.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });

    const play = React.useCallback(
        (id: string, index: number) => {
            navigate("/video/" + id + "/" + index);
        },
        [navigate]
    );

    return (
        <Drawer
            isOpen={isCardOpen}
            placement="bottom"
            onClose={() => {
                setSelectedCard(undefined);
                setCardOpen(true);
            }}
        >
            <DrawerOverlay />
            <DrawerContent h="100%" w="100%" bg={"#141414"}>
                <React.Suspense>
                    <Topbar
                        showBorder={false}
                        title={"Visionner"}
                        icons={[
                            {
                                icon: <ChevronDownIcon boxSize={"8"} />,
                                click: () => {
                                    setSelectedCard(undefined);
                                    setCardOpen(false);
                                },
                            },
                        ]}
                    />
                </React.Suspense>
                <Box pos={"relative"} overflowY="scroll">
                    <LazyLoadImage
                        src={item.image.length > 0 ? item.image : "https://picsum.photos/420/280"}
                        width={"100%"}
                        style={{
                            width: "100%",
                            height: "280px",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderBottom: "2px solid white",
                            borderTop: "2px solid white"
                        }}
                        effect="blur"
                    />
                    <Flex justifyContent={"space-between"} columnGap={2} padding={2}>
                        <Button
                            leftIcon={<PlayIcon boxSize={5} />}
                            w="90%"
                            fontWeight={"bold"}
                            color={item.videos.length > 0 ? "#e1e1e1" : "gray.800"}
                            bg="blackAlpha.800"
                            borderRadius={"md"}
                            _hover={{
                                background: "blackAlpha.800",
                            }}
                            onClick={() => {
                                if (item.videos.length > 0) {
                                    play(item.id, item.is_movie ? 0 : item.last);
                                }
                            }}
                        >
                            Regarder{" "}
                            {item.videos.length > 0 &&
                                (!item.is_movie ? " - E" + (item.last + 1) : "")}
                        </Button>
                        <IconButton
                            icon={<EditIcon boxSize={5} />}
                            color="white"
                            p={3}
                            bg="blackAlpha.800"
                            borderRadius={"md"}
                            _hover={{
                                background: "blackAlpha.800",
                            }}
                            onClick={() => {
                                setCreateOpen(true);
                                setCardOpen(false);
                            }}
                            aria-label={""}
                        />
                        <IconButton
                            icon={<DeleteIcon boxSize={5} />}
                            color="white"
                            p={3}
                            bg="blackAlpha.800"
                            borderRadius={"md"}
                            _hover={{
                                background: "blackAlpha.800",
                            }}
                            onClick={() => {
                                setIsOpenDelete(true);
                            }}
                            aria-label={""}
                        />
                    </Flex>
                    <Heading
                        fontSize="2xl"
                        fontWeight={"bold"}
                        p={2}
                        color={"#e1e1e1"}
                        textTransform="capitalize"
                    >
                        {item.title}
                    </Heading>
                    <Text p={2} mt={-2} color={"#e1e1e1"}>
                        {item.description.length == 0
                            ? "Aucune description."
                            : item.description}
                    </Text>
                    <Text p={2} fontSize="sm" color={"gray.400"}>
                        Ajoutée {dateStr}
                    </Text>
                    {!item.is_movie &&
                        item.videos.map((vid, index) => (
                            <Box key={index}>
                                <LazyLoadImage
                                    src={vid.video.image.length > 0 ? vid.video.image : "https://picsum.photos/375/280"}
                                    width={"100%"}
                                    style={{
                                        width: "100%",
                                        height: "250px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        borderBottom: "2px solid white",
                                        borderTop: "2px solid white"
                                    }}
                                    effect="blur"
                                    onClick={() => {
                                        play(item.id, index);
                                    }}
                                />
                                <Flex
                                    borderBottom={
                                        index + 1 == item.videos.length ? "none" : "1px solid"
                                    }
                                    p={2}
                                    color="white"
                                    justifyContent={"space-between"}
                                    alignItems="center"
                                >
                                    <Text
                                        bg="transparent"
                                        p={2}
                                        textTransform="uppercase"
                                        w={"60%"}
                                    >
                                        {item.is_movie ? item.title : vid.title}
                                    </Text>
                                    <Text>{Math.round(vid.video.progress * 100)}%</Text>
                                    {!item.is_movie && (
                                        <Button
                                            color='gray.400'
                                            bg="transparent"
                                            border="1px solid"
                                            borderColor={"gray.600"}
                                            onClick={() => {
                                                play(item.id, index);
                                            }}
                                        >
                                            E{index + 1}
                                        </Button>
                                    )}
                                </Flex>
                            </ Box>
                        ))}
                    <Box w="100%" h="40px"></Box>
                </Box>
            </DrawerContent>
            <DeleteModal
                isOpen={isOpenDelete}
                onClose={(deleted) => {
                    setIsOpenDelete(false);
                    if (deleted) {
                        setCardOpen(false);
                    }
                }}
                onDelete={async () => {
                    if (selectedCard !== undefined) {
                        await storage.remove(selectedCard.id);
                        setSelectedCard(undefined);
                    }
                }}
            />
        </Drawer>
    );
};

export default CardDrawer;
