
import React from "react";
import {
    IconButton,
    PopoverContent,
    PopoverTrigger,
    VStack,
    Input,
    Popover,
    Button,
    FocusLock,
} from "@chakra-ui/react";
import {
    EditIcon,
    DeleteIcon,
} from "@chakra-ui/icons";

import { ConfirmModal } from '../ConfirmModal';
import { storage } from '../api/storage';
import { runAsync } from "../api/utility";

export function CardEditButton({ item, setItems }) {
    const [isOpen, setOpen] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const [card, setCard] = React.useState({
        title: "",
        image_uri: "",
        overview: "",
    });

    React.useEffect(() => {
        setCard({
            title: item.data.title || "",
            image_uri: item.image_uri || "",
            overview: item.overview || "",
        });
    }, [item]);

    const editItem = React.useCallback((newit)=>{
        runAsync(async ()=>{
            await storage.set(item.id, newit);
            const items = await storage.getAll();
            setItems(items);
        })
    }, [item, setItems])

    const deleteItem = React.useCallback(()=>{
        runAsync(async () => {
            await storage.remove(item.id);
            const items = await storage.getAll();
            setItems(items);
        })
    }, [item, setItems])

    return (
        <>
            <Popover
                isOpen={isOpen}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                placement="bottom"
                closeOnBlur={true}
            >
                <PopoverTrigger>
                    <IconButton
                        size="sm"
                        icon={<EditIcon />}
                        position="absolute"
                        right={"20px"}
                    />
                </PopoverTrigger>
                <PopoverContent p={5} bg="#161616" color="white">
                    <FocusLock returnFocus persistentFocus={false}>
                        <VStack gap={5}>
                            <Input
                                placeholder="titre"
                                value={card.title}
                                focusBorderColor="white"
                                onChange={(evt) => {
                                    setCard({ ...card, title: evt.target.value });
                                }}
                            />
                            <Input
                                placeholder="https://.../image.png"
                                value={card.image_uri}
                                focusBorderColor="white"
                                onChange={(evt) => {
                                    setCard({ ...card, image_uri: evt.target.value });
                                }}
                            />
                            <Input
                                placeholder="description"
                                value={card.overview}
                                focusBorderColor="white"
                                onChange={(evt) => {
                                    setCard({ ...card, overview: evt.target.value });
                                }}
                            />
                        </VStack>
                        <Button
                            mt="50px"
                            color="#161616"
                            w={"100%"}
                            onClick={() => {
                                editItem({
                                    ...item,
                                    data: {
                                     ...item.data,
                                      title: card.title.length == 0 ? "" : card.title   
                                    },
                                    overview:
                                        card.overview.length == 0 ? "" : card.overview,
                                    image_uri:
                                        card.image_uri.length == 0 ? "" : card.image_uri,
                                });
                                setOpen(false);
                            }}
                        >
                            Modifier
                        </Button>
                    </FocusLock>
                </PopoverContent>
            </Popover>
            <IconButton
                size="sm"
                icon={<DeleteIcon />}
                position="absolute"
                right={"80px"}
                onClick={() => {
                    setOpen(false);
                    setConfirmOpen(true);
                }}
            />

            <ConfirmModal title={"Confirmer la suppression"} isOpen={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={() => {
                setConfirmOpen(false);
                deleteItem();
            }} />
        </>
    );
}