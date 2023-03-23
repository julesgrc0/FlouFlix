import { Flex, Heading, IconButton } from "@chakra-ui/react";

export default function Topbar({ title, showBorder, icons }) {

    return (
        <Flex
            padding={5}
            columnGap={5}
            justifyContent="space-between"
            borderBottom={"2px solid"}
            bg={"#141414"}
            borderColor={showBorder ? "white" : "transparent"}
        >
            <Heading
                id="menufont"
                color="#e1e1e1"
                lineHeight={"base"}
                fontSize={30}
                fontWeight={"bold"}
                whiteSpace="nowrap"
                w={10 * (10 - icons.length) + "%"}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
            >
                {title}
            </Heading>
            <Flex columnGap={8}>
                {icons.map((icon, index) => (
                    <IconButton bg='transparent' _hover={{ background:'transparent' }} key={index} color="white"  icon={icon.icon} onClick={icon.click} />
                ))}
            </Flex>
        </Flex>
    );
}
