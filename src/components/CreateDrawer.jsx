import React from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    Input,
    Image,
    VStack,
    Text,
    Button,
    Box,
    Checkbox,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    Flex,
} from "@chakra-ui/react";
import Topbar from "./Topbar";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { AutofixIcon, DeleteIcon, EditIcon } from "./Icons";
import { storage } from "../api/storage";

function CInput({ placeholder, text, setText }) {
    return (
        <Input
            border={"2px solid"}
            borderRadius="md"
            bg="transparent"
            p={5}
            mb={4}
            focusBorderColor={"white"}
            borderColor={"gray.800"}
            color={"white"}
            outline={"none"}
            w={"100%"}
            placeholder={placeholder}
            value={text}
            onChange={(evt) => {
                setText(evt.target.value);
            }}
        />
    );
}

function CButton({ text, loading, onClick, fill }) {
    return (
        <Button
            onClick={onClick}
            isLoading={loading}
            border={"2px solid"}
            borderColor="gray.600"
            p={3}
            borderRadius="md"
            bg={fill ? "gray.600" : "#141414"}
            color={"white"}
            _hover={{ background: fill ? "gray.600" : "#141414" }}
            w={"100%"}
        >
            {text}
        </Button>
    );
}

function EditDrawer({
    isCreateOpen,
    setCreateOpen,

    dtitle,
    ddesc,
    dimage,
    dismovie,
    dvideos,
    did,
}) {
    const [title, setTitle] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [image, setImage] = React.useState("");
    const [isMovie, setIsMovie] = React.useState(true);
    const [videos, setVideos] = React.useState([]);

    const [isOpen, setOpen] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [autoComplete, setAutoComplete] = React.useState(true);

    const [videoItem, setVideoItem] = React.useState({
        title: undefined,
        url: undefined,
        index: -1,
    });

    React.useEffect(() => {
        if (!isCreateOpen) {
            return;
        }

        if (did != undefined) {
            setTitle(dtitle);
            setDesc(ddesc);
            setIsMovie(dismovie);
            setVideos(dvideos);
            setImage(dimage);
        } else {
            setTitle("");
            setDesc("");
            setIsMovie(true);
            setVideos([]);
            setImage("");
        }
    }, [isCreateOpen]);

    const onClose = React.useCallback(() => {
        setTitle("");
        setDesc("");
        setImage("");
        setIsMovie(true);
        setVideos([]);
        setOpen(false);
        setCreateOpen(false);
        setLoading(false);
        setAutoComplete(true);
    }, [
        setCreateOpen,
        setTitle,
        setDesc,
        setImage,
        setIsMovie,
        setVideos,
        setOpen,
        setLoading,
        setAutoComplete,
    ]);

    const onCreate = React.useCallback(() => {
        setLoading(true);

        (async () => {
            if (did != undefined) {
                await storage.remove(did);
            }
            await storage.createItem({
                title,
                description: desc,
                image,
                is_movie: isMovie,
                videos,
                last: 0,
                next: videos.length >= 2 ? 1 : -1,
            });

            await new Promise((resolve) => setTimeout(resolve, 400));

            onClose();
        })();
    }, [onClose, setLoading, title, desc, image, isMovie, videos]);

    return (
        <Drawer isOpen={isCreateOpen} placement="bottom" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent
                h="100%"
                w="100%"
                bg={"#141414"}
            >
                <Topbar
                    title={did ? "Modification" : "Nouvelle vidéo"}
                    showBorder={false}
                    icons={[
                        {
                            icon: <ChevronDownIcon boxSize={"8"} />,
                            click: onClose,
                        },
                    ]}
                />

                <Box pos={"relative"} overflowY="scroll" p={5}>
                    <Flex columnGap={5} justifyContent="space-between">
                        <CInput
                            placeholder="Titre..."
                            text={title}
                            setText={(text) => {
                                setTitle(text);
                                if (autoComplete) {
                                    if (text.length < 2) {
                                        setDesc("");
                                        setImage("");
                                    } else {
                                        storage
                                            .apiSearchVideo(text, isMovie ? "movie" : "tv")
                                            .then((item) => {
                                                setImage(item.image);
                                                setDesc(item.description);
                                            })
                                            .catch(() => { });
                                    }
                                }
                            }}
                        />
                        <IconButton
                            icon={<AutofixIcon boxSize={6} />}
                            onClick={() => {
                                setAutoComplete(!autoComplete);
                            }}
                            bg="transparent"
                            _hover={{ background: "transparent" }}
                            color={!autoComplete ? "gray.800" : "gray.200"}
                            border="2px solid"
                        />
                    </Flex>
                    <CInput placeholder="Description" text={desc} setText={setDesc} />
                    <CInput placeholder="Image http://" text={image} setText={setImage} />
                    <Image
                        src={image}
                        onError={(evt) => {
                            evt.target.src = "https://picsum.photos/1280/720";
                        }}
                        borderRadius="lg"
                        w="100%"
                        h={"280px"}
                        objectFit={"cover"}
                    />
                    <Checkbox
                        alignSelf={"flex-start"}
                        mt={5}
                        mb={5}
                        ml={2}
                        colorScheme={"whiteAlpha.900"}
                        color={"white"}
                        isChecked={!isMovie}
                        outline="none"
                        onChange={(e) => {
                            if (videos.length != 0) {
                                setConfirmOpen(true);
                            } else {
                                setIsMovie(!isMovie);
                            }
                        }}
                    >
                        Serie de vidéo
                    </Checkbox>
                    <Box bg="blackAlpha.600" p={2} w={"100%"} borderRadius="md" mb="40px">
                        {(videos.length == 0 || !isMovie) && (
                            <IconButton
                                icon={<AddIcon boxSize={4} />}
                                border="2px solid white"
                                color="white"
                                bg="transparent"
                                _hover={{ background: "transparent" }}
                                onClick={() => {
                                    setVideoItem({
                                        title: undefined,
                                        url: undefined,
                                        index: -1,
                                    });
                                    setOpen(true);
                                }}
                            />
                        )}

                        {videos.map((vid, index) => (
                            <Flex
                                key={index}
                                borderBottom={index + 1 == videos.length ? "none" : "1px solid"}
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
                                    {isMovie ? title : vid.title}
                                </Text>
                                <IconButton
                                    icon={<EditIcon />}
                                    bg="transparent"
                                    _hover={{ background: "transparent" }}
                                    border={"1px solid"}
                                    borderColor="gray.900"
                                    onClick={() => {
                                        setVideoItem({
                                            title: vid.title,
                                            url: vid.video.referer,
                                            index,
                                        });
                                        setOpen(true);
                                    }}
                                />
                                <IconButton
                                    icon={<DeleteIcon />}
                                    bg="transparent"
                                    _hover={{ background: "transparent" }}
                                    border={"1px solid"}
                                    borderColor="gray.900"
                                    onClick={() => {
                                        let vids = [...videos]
                                        vids.splice(index, 1);
                                        setVideos(vids);
                                    }}
                                />
                            </Flex>
                        ))}
                    </Box>
                    {did == undefined && (
                        <CButton
                            text={"Ajouter " + (!isMovie ? "ma série" : "mon film")}
                            onClick={onCreate}
                            loading={loading}
                        />
                    )}
                    {did && (
                        <CButton
                            text={"Mettre à jour"}
                            onClick={onCreate}
                            loading={loading}
                        />
                    )}
                </Box>
            </DrawerContent>
            <VideoModal
                isOpen={isOpen}
                isMovie={isMovie}
                dtitle={videoItem.title}
                durl={videoItem.url}
                onClose={() => {
                    setVideoItem({
                        title: undefined,
                        url: undefined,
                        index: -1,
                    });
                    setOpen(false);
                }}
                addVideo={(title, url, referer) => {
                    if (videoItem.index != -1) {
                        videos[videoItem.index] = storage.createVideoItem(
                            title,
                            url,
                            referer
                        );
                        setVideos(videos);
                        setVideoItem({
                            title: undefined,
                            url: undefined,
                            index: -1,
                        });
                    } else {
                        let item = storage.createVideoItem(title, url, referer);

                        if (isMovie) {
                            setVideos([item]);
                        } else {
                            videos.push(item);
                            setVideos(videos);
                        }
                    }

                    setOpen(false);
                }}
            />
            <ConfirmClose
                isOpen={confirmOpen}
                onClose={() => {
                    setConfirmOpen(false);
                }}
                onConfirm={() => {
                    setIsMovie(!isMovie);
                    setVideos([]);
                    setConfirmOpen(false);
                }}
            />
        </Drawer>
    );
}

function ConfirmClose({ isOpen, onClose, onConfirm }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered={true}
            closeOnOverlayClick={true}
        >
            <ModalOverlay />
            <ModalContent bg={"#141414"} w={"90%"} p={5}>
                <Text color={"white"}>Toutes vos vidéo ajouter seront perdu !</Text>
                <Flex mt="30px" gap={2} w="100%">
                    <CButton onClick={onClose} text="Annuler" loading={false} />
                    <CButton fill={true} onClick={onConfirm} text="Confirmer" />
                </Flex>
            </ModalContent>
        </Modal>
    );
}

function VideoModal({ isMovie, isOpen, onClose, addVideo, dtitle, durl }) {
    const [title, setTitle] = React.useState("");
    const [url, setUrl] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const close = React.useCallback(() => {
        setTitle("");
        setUrl("");
        setLoading(false);
        onClose();
    }, [onClose, setUrl, setTitle, setLoading]);

    React.useEffect(() => {
        setTitle(dtitle ?? "");
        setUrl(durl ?? "");
    }, [dtitle, durl]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            isCentered={true}
            closeOnOverlayClick={true}
        >
            <ModalOverlay />
            <ModalContent bg={"#141414"} w={"90%"} p={5}>
                <VStack>
                    {!isMovie && (
                        <CInput
                            placeholder={"Épisode 1..."}
                            text={title}
                            setText={setTitle}
                        />
                    )}
                    <CInput
                        placeholder={"https://player/video-id.html"}
                        text={url}
                        setText={setUrl}
                    />
                </VStack>
                <Flex mt="30px" gap={2} w="100%">
                    <CButton onClick={close} text="Annuler" loading={false} />
                    <CButton
                        fill={true}
                        onClick={() => {
                            if (!loading) {
                                setLoading(true);
                                setTimeout(() => {
                                    storage
                                        .extractVideo(url)
                                        .then((video) => {
                                            addVideo(title, video, url);
                                            setTitle("");
                                            setUrl("");
                                            setLoading(false);
                                        })
                                        .catch(() => {
                                            setUrl("");
                                            setLoading(false);
                                        });
                                }, 500);
                            }
                        }}
                        loading={loading}
                        text="Ajouter"
                    />
                </Flex>
            </ModalContent>
        </Modal>
    );
}

export default function CreateDrawer({
    isCreateOpen,
    setCreateOpen,
    selectedCard,
    setSelectedCard,
}) {
    if (selectedCard == undefined) {
        return (
            <EditDrawer isCreateOpen={isCreateOpen} setCreateOpen={setCreateOpen} />
        );
    }
    return (
        <EditDrawer
            isCreateOpen={isCreateOpen}
            setCreateOpen={(value) => {
                setCreateOpen(value);
                setSelectedCard(undefined);
            }}
            dtitle={selectedCard.title}
            ddesc={selectedCard.description}
            dimage={selectedCard.image}
            dismovie={selectedCard.is_movie}
            dvideos={selectedCard.videos}
            did={selectedCard.id}
        />
    );
}
