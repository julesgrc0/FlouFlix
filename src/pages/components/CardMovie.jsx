import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Heading,
    Card,
    CardHeader,
    CardBody,
    Text,
    Image,
    Spinner
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

import { CardEditButton } from './CardEditButton';
import { useVideoUpdate } from "./useVideoUpdate";
import { storage } from '../../storage'

function _CardMovie({ item, setItems })  {
    const navigate = useNavigate();
    const { title, date } = item.data;
    const { update, error, loading } = useVideoUpdate(item.data, async (newItem) => {
        await storage.set(item.id, newItem)
        const items = await storage.getAll();
        setItems(items);
    });

    const ref = React.useRef(null);
    return (
        <motion.div
            initial={{
                opacity:  0,
            }}
            whileInView={{
                opacity: 1
            }}
            
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <Card mt={"2"} >
                <CardHeader>
                    <CardEditButton item={item} setItems={setItems} />

                    <Heading
                        size="md"
                        onClick={() => {
                            if (!error) {
                                navigate("/video/" + item.id);
                            } else {
                                update()
                            }
                        }}
                        w={"68%"}
                        color={error ? 'blackAlpha.600' : 'blackAlpha.800'}
                    >
                        {error && !loading && <WarningTwoIcon fontSize='sm' mr='3' onClick={update} />}
                        {error && loading && <Spinner size='xs' mr='3' />}
                        {title}
                    </Heading>
                    <Box
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                        mt="2"
                    >
                        {date || new Date().toLocaleDateString("fr")} &bull; film
                    </Box>
                    {item.overview && (
                        <Box>
                            <Text>{item.overview}</Text>
                        </Box>
                    )}
                </CardHeader>

                {item.image_uri && (
                    <CardBody>
                        <Image src={item.image_uri} borderRadius="lg" />
                    </CardBody>
                )}
            </Card>
        </motion.div>
    );
}

export const CardMovie = React.memo(_CardMovie, (op, np) => {
    if (op.item != np.item) {
        return false;
    }

    return true;
})