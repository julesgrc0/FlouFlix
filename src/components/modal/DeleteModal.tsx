import React from "react";
import {
    Heading,
    Button,
    Modal,
    ModalContent,
    ModalOverlay,
    HStack} from "@chakra-ui/react";


export type DeleteModalProps = {
    isOpen: boolean;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    onDelete: () => Promise<void>;
};

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onDelete }) => {
    const [loading, setLoading] = React.useState(false);
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => onClose(false)}
            isCentered={true}
            closeOnOverlayClick={true}
        >
            <ModalOverlay />

            <ModalContent bg={"#141414"} w={"90%"} p={5}>
                <Heading color={"white"} fontSize="2xl">
                    Confirmer la supression
                </Heading>
                <HStack mt={10}>
                    <Button w={"100%"} onClick={() => onClose(false)}>
                        Annuler
                    </Button>
                    <Button
                        isLoading={loading}
                        w={"100%"}
                        _hover={{ background: "transparent" }}
                        bg="transparent"
                        border={"2px solid"}
                        borderColor="gray.400"
                        color="gray.400"
                        onClick={() => {
                            setLoading(true)
                            setTimeout(async () => {
                                await onDelete();
                                setLoading(false);
                                onClose(true);
                            }, 400);
                        }}
                    >
                        Confirmer
                    </Button>
                </HStack>
            </ModalContent>
        </Modal>
    );
}

