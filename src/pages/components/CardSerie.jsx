import React from "react";
import {
  Box,
  Heading,
  Card,
  CardHeader,
  StackDivider,
  Stack,
  CardBody,
  Text,
  Image,
  IconButton,
} from "@chakra-ui/react";
import {
  AddIcon,
} from "@chakra-ui/icons";

import { motion } from "framer-motion";
import { CardSerieItem } from './CardSerieItem';
import { CardEditButton } from './CardEditButton';


 function _CardSerie ({ item, setItems, openDrawer })  {
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
      <Card mt={"2"}>
        <CardHeader>
          <CardEditButton item={item} setItems={setItems} />
          <Heading size="lg" w={"68%"}>
            {item.data.title}
          </Heading>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            mt="2"
          >
            {item.data.date || new Date().toLocaleDateString("fr")} &bull;{" "}
            {item.list.length} vidéos
          </Box>
        </CardHeader>

        {(item.image_uri.length != 0 || item.list.length != 0 || item.overview.length != 0) && (
          <CardBody>
            {item.image_uri && <Image src={item.image_uri} borderRadius="lg" />}
            {item.overview && (
              <Box>
                <Text>{item.overview}</Text>
              </Box>
            )}
            {item.list.length != 0 && (
              <>
                <Heading mt="5" size="md">
                  Épisodes
                </Heading>
                <Stack divider={<StackDivider />} spacing="4" mt="5" >
                  {item.list.map((it, index) => 
                  <CardSerieItem 
                    key={index} 
                    index={index}
                    item={it} 
                    setItems={setItems}
                    id={item.id} 
                  />)}
                </Stack>
              </>
            )}
          </CardBody>
        )}
      </Card>

      <IconButton
        icon={<AddIcon />}
        bg="white"
        w={"100%"}
        mt="2"
        onClick={openDrawer}
      />
    </motion.div>
  );
}

export const CardSerie = React.memo(_CardSerie, (op, np) => {
  if (op.item != np.item) {
    return false;
  }

  return true;
})