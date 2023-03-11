import React from "react";
import {
    Stack,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    VStack,
    Input,
    Radio,
    RadioGroup,
    Button,
} from "@chakra-ui/react";
import {
    ArrowForwardIcon,
} from "@chakra-ui/icons";




export function DrawerAddCard({ isOpen, setOpen, onCreate }) {
    const [selected, setSelected] = React.useState("movie");
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
                        Nouvelle vidéo
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack mt={"10px"} mb="50px" gap={5}>
                            <Input
                                placeholder="Titre"
                                focusBorderColor="#161616"
                                value={title}
                                onChange={(evt) => {
                                    setTitle(evt.target.value);
                                }}
                            />
                            <RadioGroup
                                alignSelf={"flex-start"}
                                onChange={(evt) => {
                                    setSelected(evt);
                                }}
                                value={selected}
                            >
                                <Stack>
                                    <Radio value="movie" colorScheme={"blackAlpha"}>
                                        Film
                                    </Radio>
                                    <Radio value="serie" colorScheme={"blackAlpha"}>
                                        Série
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                            {selected == "movie" && (
                                <Input
                                    placeholder="http://"
                                    focusBorderColor="#161616"
                                    value={url}
                                    onChange={(evt) => {
                                        setUrl(evt.target.value);
                                    }}
                                />
                            )}
                        </VStack>

                        <Button
                            mb="30px"
                            rightIcon={<ArrowForwardIcon />}
                            colorScheme="#161616"
                            variant="outline"
                            w={"100%"}
                            onClick={() => {
                                onCreate(title, selected, url);
                                setOpen(false);
                                setUrl("");
                                setTitle("");
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
