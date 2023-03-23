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
    Box
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { PlayIcon, EditIcon, DeleteIcon } from "./Icons";
import Topbar from "./Topbar";
import { storage } from "../api/storage";
import { useNavigate } from "react-router-dom";

export default function CardDrawer({
    setSelectedCard,
    selectedCard,
    isCardOpen,
    setCardOpen,
    setCreateOpen
}) {
    const [isOpenDelete, setIsOpenDelete] = React.useState(false);
    const navigate = useNavigate();
    const item = {
        id: "0",
        title: "",
        description: "",
        image: "",
        date: new Date().getTime(),
        is_movie: true,
        videos: [],
        ...selectedCard,
    };
    const date = new Date(item.date);
    const dateStr =
        " le " +
        date.toLocaleDateString("fr", { day: "2-digit", month: "2-digit" }) +
        " à " +
        date.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });


    const play = React.useCallback((id, index) => {
        navigate("/video/" + id + "/" + index)
    }, [navigate])

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
                <Box pos={"relative"} overflowY="scroll">
                    <Image
                        src={item.image}
                        onError={(evt) => {
                            evt.target.src = "https://picsum.photos/1280/720";
                        }}
                        w="100%"
                        h={"280px"}
                        objectFit={"cover"}
                        borderBottom="2px solid"
                        borderTop="2px solid"
                        borderColor={"white"}
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
                                    play(item.id, item.is_movie ? 0 : item.last)
                                }
                            }}
                        >
                            Regarder {item.videos.length > 0 && (!item.is_movie ? " - E" + (item.last + 1) : "")}
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
                        Ajouter {dateStr}
                    </Text>
                    {!item.is_movie && item.videos.map((vid, index) =>
                        <Flex key={index} borderBottom={index + 1 == item.videos.length ? "none" : "1px solid"} p={2} color="white" justifyContent={"space-between"} alignItems="center">
                            <Text bg='transparent' p={2} textTransform="uppercase" w={"60%"}>{item.is_movie ? item.title : vid.title}</Text>
                            {!item.is_movie && <Button bg='transparent' border='1px solid' borderColor={"gray.600"}
                                onClick={() => {
                                    play(item.id, index)
                                }}>E{index + 1}</Button>}
                        </Flex>)}
                        <Box w="100%" h="40px"></Box>
                </Box>
            </DrawerContent>
            <DeleteModal
                isOpen={isOpenDelete}
                onClose={(deleted) => {
                    setIsOpenDelete(false)
                    if (deleted) {
                        setCardOpen(false);
                    }
                }}
                onDelete={async () => {
                    await storage.remove(selectedCard.id)
                    setSelectedCard(undefined)
                }}
            />
        </Drawer>
    );
}

function DeleteModal({ isOpen, onClose, onDelete }) {
    const [loading, setLoading] = React.useState(false);
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose(false)}
            isCentered={true}
            closeOnOverlayClick={true}
        >
            <ModalOverlay />

            <ModalContent bg={"#141414"} w={"90%"} p={5}>
                <Heading color={"white"} fontSize="2xl">
                    Confirmer la supression
                </Heading>
                <HStack mt={10}>
                    <Button w={"100%"} onClick={() => onClose(false)}>
                        Annuler
                    </Button>
                    <Button
                        isLoading={loading}
                        w={"100%"}
                        _hover={{ background: "transparent" }}
                        bg="transparent"
                        border={"2px solid"}
                        borderColor="gray.400"
                        color="gray.400"
                        onClick={() => {
                            setLoading(true)
                            setTimeout(async () => {
                                await onDelete();
                                setLoading(false);
                                onClose(true);
                            }, 400);
                        }}
                    >
                        Confirmer
                    </Button>
                </HStack>
            </ModalContent>
        </Modal>
    );
}
