import React from "react";
import { X } from "react-feather";
import { Overlay, Wrapper, CloseButton } from "./Dialog.styles";

const Dialog = ({ isOpen, onClose, children }) => {
    return (
        <Overlay isOpen={isOpen}>
            <Wrapper aria-label="dialog">
                <CloseButton onClick={onClose}>
                    <X />
                </CloseButton>
                <div>{children}</div>
            </Wrapper>
        </Overlay>
    )
}

export default Dialog;