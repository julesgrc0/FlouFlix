import React from "react";
import {
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    Flex,
} from "@chakra-ui/react";
import { ItemVideoContent, storage } from "../../api/storage";
import CInput from '../gui/CInput';
import CButton from '../gui/CButton';

export type SelectedVideoItem = {
    title?: string;
    url?: string;
    index: number;
}

export type VideoModalProps = {
    isMovie: boolean;
    isOpen: boolean;
    onClose: () => void;
    addVideo: (title: string, videoContent: ItemVideoContent) => void;

    itemVideo?: SelectedVideoItem;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isMovie, isOpen, onClose, addVideo, itemVideo }) => {
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
        setTitle(itemVideo?.title ?? "");
        setUrl(itemVideo?.url ?? "");
    }, [itemVideo]);

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
                    <CButton onClick={close} text="Annuler" loading={false} fill={false} />
                    <CButton
                        fill={true}
                        onClick={() => {
                            if (!loading) {
                                setLoading(true);
                                setTimeout(() => {
                                    storage
                                        .extractVideo(url)
                                        .then((video) => {
                                            addVideo(title, video);
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