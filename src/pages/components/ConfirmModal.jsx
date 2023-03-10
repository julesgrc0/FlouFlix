import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
} from '@chakra-ui/react';

export function ConfirmModal({ isOpen, onConfirm, onCancel, title }) {
    return <Modal isOpen={isOpen} onClose={onCancel}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalFooter>
                <Button bg='blackAlpha.800' color={'white'} mr={3} onClick={onCancel}>
                    Annuler
                </Button>
                <Button onClick={onConfirm}>Supprimer</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
}
