import React from "react";
import { Avatar, Flex, Heading } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

export function TopBar({ setDrawerOpen, drawerOpen }) {
    return (
        <Flex padding={5} borderBottom={"3px solid"} color={"white"} columnGap={5}>
            <Heading lineHeight={"base"}>FlouFlix</Heading>
            <Avatar
                icon={<AddIcon />}
                borderRadius={"6px"}
                ml="auto"
                bg={"white"}
                color={"black"}
                onClick={() => {
                    setDrawerOpen(!drawerOpen);
                }}
            />
        </Flex>
    );
}

