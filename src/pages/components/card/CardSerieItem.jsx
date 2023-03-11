import React from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Heading,
    CloseButton,
    Spinner,
} from "@chakra-ui/react";

import { WarningTwoIcon } from "@chakra-ui/icons";
import { ConfirmModal } from '../ConfirmModal';

import { useVideoUpdate } from "../hooks/useVideoUpdate";
import { runAsync } from "../api/utility";
import { storage } from '../api/storage';

 function _CardSerieItem({ item, index, id, setItems }) {
     const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);
    const { update, error, loading } = useVideoUpdate(item, async (newItem)=>{
        await storage.editSerieItem(id, index, newItem)
        const items = await storage.getAll();
        setItems(items);

        return false;
    });

    return <Box key={index} padding={2} pos="relative">
        <Heading
            size="xs"
            textTransform="uppercase"
            color={error ? 'blackAlpha.600' : 'blackAlpha.800'}
            onClick={() => {
                if (!error) {
                    navigate("/video/"+id+"?index="+ index);
                }
            }}

            w="80%"
        >
            {error && !loading && <WarningTwoIcon fontSize='sm' mr='3' onClick={update} />}
            {loading && <Spinner size='xs' mr='3' />}
            {item.title} &bull; {item.date}
        </Heading>
        <CloseButton
            pos={"absolute"}
            top="50%"
            transform={"translateY(-50%)"}
            right="5%"
            onClick={() => {
                setOpen(true);
            }}
        />
        <ConfirmModal title={"Confirmer la suppression de la vidéo"} isOpen={open} onCancel={() => setOpen(false)} onConfirm={() => {
            runAsync(async ()=>{
                await storage.removeSerieItem(id, index);
                const items = await storage.getAll();
                setItems(items);
                setOpen(false);
            })
        }} />
    </Box>
}

export const CardSerieItem = React.memo(_CardSerieItem, (op, np)=>{
    if(op.item != np.item)
    {
        return false;
    }
    if(op.index != np.index)
    {
        return false;
    }
    if(op.id != np.id)
    {
        return false;
    }

    return true;
})