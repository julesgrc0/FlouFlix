import React from "react";
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    VStack,
    Input,
    Button,
} from "@chakra-ui/react";
import {
    ArrowForwardIcon,
} from "@chakra-ui/icons";
import { storage } from '../api/storage';

export function DrawerAddSerieItem({ isOpen, setOpen, selected, setItems }) {
    const [url, setUrl] = React.useState("");
    const [title, setTitle] = React.useState("");

    return (
        <>
            <Drawer
                placement={"bottom"}
                onClose={() => setOpen(false)}
                isOpen={isOpen}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader
                        padding={6}
                        fontSize={24}
                        borderBottomWidth="3px"
                        borderColor={"blackAlpha.800"}
                        color="blackAlpha.800"
                    >
                        Ajouter à "{selected.data.title}"
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack mt={"10px"} mb="50px" gap={5}>
                            <Input
                                placeholder="Épisode ..."
                                focusBorderColor="#161616"
                                value={title}
                                onChange={(evt) => {
                                    setTitle(evt.target.value);
                                }}
                            />
                            <Input
                                placeholder="http://"
                                focusBorderColor="#161616"
                                value={url}
                                onChange={(evt) => {
                                    setUrl(evt.target.value);
                                }}
                            />
                        </VStack>
                        <Button
                            mb="30px"
                            rightIcon={<ArrowForwardIcon />}
                            colorScheme="#161616"
                            variant="outline"
                            w={"100%"}
                            onClick={() => {
                                (async () => {
                                    let serieItem = await storage.createItem(title, url);
                                    await storage.addSerieItem(selected.id, serieItem)

                                    const items = await storage.getAll();
                                    setItems(items);


                                    setUrl("");
                                    setTitle("");
                                    setOpen(false);
                                })()
                            }}
                        >
                            Ajouter
                        </Button>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
