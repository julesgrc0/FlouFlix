import React from "react";
import {
    Button,
} from "@chakra-ui/react";

type CButtonProps = {
    text: string;
    loading: boolean;
    fill: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const CButton: React.FC<CButtonProps> = ({ text, loading, onClick, fill }) => {
    return (
        <Button
            onClick={onClick}
            isLoading={loading}
            border={"2px solid"}
            borderColor="gray.600"
            p={3}
            borderRadius="md"
            bg={fill ? "gray.600" : "#141414"}
            color={"white"}
            _hover={{ background: fill ? "gray.600" : "#141414" }}
            w={"100%"}
        >
            {text}
        </Button>
    );
}


export default CButton;