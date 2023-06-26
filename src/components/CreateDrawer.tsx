import React from "react";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    Image,
    Text,
    Box,
    Checkbox,
    IconButton,
    Flex,
} from "@chakra-ui/react";
import Topbar from "./Topbar";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { AutofixIcon, DeleteIcon, EditIcon } from "./Icons";
import { Item, ItemVideo, ItemVideoContent, storage } from "../api/storage";

import CInput from './gui/CInput';
import CButton from './gui/CButton';
import { VideoModal, SelectedVideoItem } from './modal/VideoAddModal';
import { ConfirmClose } from './modal/ConfirmCloseVideos';

type EditDrawerProps = {
    isCreateOpen: boolean;
    setCreateOpen: (open: boolean) => void,
    item?: Item;
};



type CreateDrawerProps = {
    isCreateOpen: boolean;
    selectedCard?: Item;
    setCreateOpen: (open: boolean) => void;
    setSelectedCard: (item?: Item) => void;
}


const EditDrawer: React.FC<EditDrawerProps> = ({
    isCreateOpen,
    setCreateOpen,
    item
}) => {
    const [title, setTitle] = React.useState<string>("");
    const [desc, setDesc] = React.useState<string>("");
    const [image, setImage] = React.useState<string>("");

    const [isOpen, setOpen] = React.useState<boolean>(false);
    const [confirmOpen, setConfirmOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);

    const [isMovie, setIsMovie] = React.useState<boolean>(true);
    const [autoComplete, setAutoComplete] = React.useState<boolean>(true);

    const [videos, setVideos] = React.useState<ItemVideo[]>([]);
    const [videoItem, setVideoItem] = React.useState<SelectedVideoItem>({
        title: undefined,
        url: undefined,
        index: -1,
    });
    const [imageShow, setShowImage] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (!isCreateOpen) {
            return;
        }

        if (item != undefined) {
            setTitle(item.title);
            setDesc(item.description);
            setIsMovie(item.is_movie);
            setImage(item.image);
            setVideos(item.videos);
        } else {
            setTitle("");
            setDesc("");
            setIsMovie(true);
            setImage("");
            setVideos([]);
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
            if (item !== undefined) {
                await storage.remove(item.id);
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
                    title={item !== undefined ? "Modification" : "Nouvelle vidéo"}
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
                            border="2px solid" aria-label={""} />
                    </Flex>
                    <CInput placeholder="Description" text={desc} setText={setDesc} />
                    <CInput placeholder="Image http://" text={image} setText={setImage} />
                    <Image
                        src={image}
                        onError={(evt: any) => {
                            evt.target.src = "https://picsum.photos/720/480";
                        }}
                        onLoad={(evt: any) => {
                            setShowImage(true);
                        }}
                        filter={imageShow ? "blur(0px)" : "blur(100px)"}
                        borderRadius="lg"
                        transition={"300ms"}
                        w="100%"
                        h={"280px"}
                        objectFit={"cover"}
                        objectPosition="center"
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
                                }} aria-label={""} />
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
                                    }} aria-label={""} />
                                <IconButton
                                    icon={<DeleteIcon />}
                                    bg="transparent"
                                    _hover={{ background: "transparent" }}
                                    border={"1px solid"}
                                    borderColor="gray.900"
                                    onClick={() => {
                                        let vids = [...videos];
                                        vids.splice(index, 1);
                                        setVideos(vids);
                                    }} aria-label={""} />
                            </Flex>
                        ))}
                    </Box>
                    {item === undefined && (
                        <CButton
                            text={"Ajouter " + (!isMovie ? "ma série" : "mon film")}
                            onClick={onCreate}
                            loading={loading} fill={false} />
                    )}
                    {item !== undefined && (
                        <CButton
                            text={"Mettre à jour"}
                            onClick={onCreate}
                            loading={loading} fill={false} />
                    )}
                </Box>
            </DrawerContent>
            <VideoModal
                isOpen={isOpen}
                isMovie={isMovie}
                itemVideo={videoItem}

                onClose={() => {
                    setVideoItem({
                        title: undefined,
                        url: undefined,
                        index: -1,
                    });
                    setOpen(false);
                }}
                addVideo={(title: string, videoContent: ItemVideoContent) => {
                    if (videoItem.index != -1) {
                        videos[videoItem.index] = storage.createVideoItem(
                            title, videoContent
                        );
                        setVideos(videos);
                        setVideoItem({
                            title: undefined,
                            url: undefined,
                            index: -1,
                        });
                    } else {
                        let item = storage.createVideoItem(title, videoContent);

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



const CreateDrawer: React.FC<CreateDrawerProps> = ({
    isCreateOpen,
    selectedCard,

    setCreateOpen,
    setSelectedCard,
}) => {
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
            item={selectedCard}
        />
    );
}

export default CreateDrawer;