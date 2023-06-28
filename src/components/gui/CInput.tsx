import React from "react";
import {
    Input,
} from "@chakra-ui/react";

import { CInputProps } from '../types';

const CInput: React.FC<CInputProps> = ({ placeholder, text, setText }) => {
    return (
        <Input
            border={"2px solid"}
            borderRadius="md"
            bg="transparent"
            p={5}
            mb={4}
            focusBorderColor={"white"}
            borderColor={"gray.800"}
            color={"white"}
            outline={"none"}
            w={"100%"}
            placeholder={placeholder}
            value={text}
            onChange={(evt) => {
                setText(evt.target.value);
            }}
        />
    );
}


export default CInput;