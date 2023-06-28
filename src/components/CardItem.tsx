import React from "react";
import {
    Card,
    Flex,
    Heading,
    CardBody,
    Text,
    CardFooter,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { Item } from "../api/storage"
import { CardItemProps } from './types';


const CardItem = ({ item, delay, onCardClick }: CardItemProps) => {

    const date = new Date(item.date);
    const dateStr = " le " + date.toLocaleDateString('fr', { day: "2-digit", month: "2-digit" }) + " à " + date.toLocaleTimeString('fr', { hour: "2-digit", minute: "2-digit" })
    const progress = item.videos.length > 0 ? Math.round(item.videos[0].video.progress * 100) : 0;

    const onClick = React.useCallback(() => {
        onCardClick(item) 
    }, [item, onCardClick])

    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            whileInView={{
                opacity: 1,
            }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay }}
        >
            <Card bg='transparent' p={1} boxShadow={'none'}>
                <CardBody pos='relative' onClick={onClick} p='0px'>
                    <LazyLoadImage
                        src={item.image.length > 0 ? item.image : "https://picsum.photos/420/280"}
                        width={"100%"}
                        style={{
                            width: "100%",
                            height: "280px",
                            borderRadius: "10px",
                            objectFit: "cover",
                            objectPosition: "center",
                            position:"relative",

                        }}
                        effect="blur"
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

                <CardFooter p='0px 10px'>
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

export default CardItem;