import React from "react";
import {
    Card,
    Flex,
    Heading,
    Image,
    CardBody,
    Text,
    CardFooter,
} from "@chakra-ui/react";
import { color, motion } from "framer-motion";

export default function CardItem({ item, openCard }) {
   
    const date = new Date(item.date);
    const dateStr = " le " +date.toLocaleDateString('fr', { day:"2-digit", month:"2-digit"}) + " à " +date.toLocaleTimeString('fr', { hour:"2-digit", minute:"2-digit" })
    const progress = item.videos.length > 0 ? Math.round(item.videos[0].video.progress * 100) : 0;
    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            whileInView={{
                opacity: 1,
            }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <Card bg='transparent' h={"335px"} p={1}>
                <CardBody pos='relative' h='280px' onClick={openCard}>
                    <Image
                        src={item.image}
                      
                        onError={(evt) => {
                            evt.target.src = "https://picsum.photos/1280/720";
                        }}
                        borderRadius="lg"
                        w="100%"
                        h={"280px"}
                        objectFit={"cover"}
                        pos="absolute"
                        left={0}
                        top={0}
                        bg='#141414'
                    />
                    <Heading
                        position={"absolute"}
                        top={5}
                        left={5}
                        fontSize="2xl"
                        color={"white"}
                        overflow={"hidden"}
                       
                        bg="#141414"
                        p={"0px 8px"}
                        borderRadius="md"
                        maxW={"80%"}
                        textTransform="capitalize"
                    >
                        {item.title}
                    </Heading>
                </CardBody>
                <CardFooter>
                    <Flex w="100%" justifyContent="space-between">
                        {!item.is_movie && (
                            <Text fontSize={"sm"} color={"gray.600"}>
                                série &bull; {item.videos.length} épisodes
                            </Text>
                        )}
                        {item.is_movie && (
                            <Text fontSize={"sm"} color={"gray.600"}>
                                film &bull; {progress}%
                            </Text>
                        )}
                        <Text fontSize={"sm"} color={"gray.600"}>
                            ajoutée {dateStr}
                        </Text>
                    </Flex>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
