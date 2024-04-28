import React, { useState, useEffect } from "react";
import { XOctagon } from "react-feather";
import {
    LastSection,
    Wrapper,
    Logo,
    ChangeWrapper,
    ChangeButton,
    InputWrapper,
    Input,
    ClearButton,
    CancelButton,
    ButtonGroup,
    InputError,
    Menu,
    Item,
    ToggleIcon,
    ToggleButton,
    InputGroup,
    RoundBox,
    ToggleChainName,
    Address,
    ItemWarning,
} from "./AddressSelection.styles";
import { AnimatePresence } from "framer-motion";
import { SectionTitle } from "../Section";
import { SecondaryButton } from "../Buttons";
import CoinSelection from "../CoinSelection/CoinSelection";
import { ChainId, CHAINS_SELECTION, CHAINS } from '../../utils/constants'
import { isValidAddress } from "../../utils/address";

import Dialog from "../Dialog";

const AddressSelection = () => {
    const selectedItem = CHAINS_SELECTION.filter((a) => a.chainId === ChainId.SHIBARIUM)[0]

    const [isConnected, setIsConnected] = useState(false)
    const [address, setAddress] = useState("");
    const [open, setOpen] = useState(false);

    const toAddress = "0x23r2E34swe23"

    useEffect(() => {
        if (toAddress) {
            setAddress(toAddress);
        }
    }, [toAddress]);

    const toggle = () => {
        // modal is closing, reset address to the current toAddress
        if (!isConnected) return;
        if (open) setAddress(toAddress || address);
        setOpen((oldOpen) => !oldOpen);
    };

    const handleChange = (evt) => {
        setAddress(evt.target.value);
    };

    const clearInput = () => {
        setAddress("");
    };

    const handleSubmit = () => {
       
    };

    const isValid = !address || isValidAddress(address);

    return (
        <AnimatePresence>
            <section className="p-2.5">
                <Wrapper className="py-5 px-3 bg-[#ffddb3] rounded-3xl">
                    <SectionTitle className="text-white text-sm sm:text-lg">To</SectionTitle>
                    <div className="flex flex-row items-center justify-between">
                        <InputGroup className="rounded-full bg-white">
                            <RoundBox as="label" className="rounded-full">
                                <ToggleButton type="button">
                                    <Logo src={selectedItem?.logoURI} alt={selectedItem?.name}  className='w-[16px] h-[24px] sm:w-[30px] sm:h-[30px]'/>
                                    <ToggleChainName className='text-sm sm:text-base'>
                                        {selectedItem?.name === "Ether"
                                            ? "Mainnet"
                                            : selectedItem?.name}
                                    </ToggleChainName>
                                    {/* {toAddress && <Address>{shortenAddress(toAddress)}</Address>} */}
                                    <ToggleIcon />
                                </ToggleButton>
                            </RoundBox>
                        </InputGroup>
                        <CoinSelection type="1"/>
                    </div>
                </Wrapper>
                <Dialog isOpen={open} onClose={toggle}>
                    <h3>Send To</h3>
                    <div>Address on {CHAINS[ChainId.SHIBARIUM].name}</div>
                    <InputWrapper>
                        <Input onChange={handleChange} value={address} />
                        <ClearButton onClick={clearInput}>
                            <XOctagon
                                fill="var(--color-gray-300)"
                                stroke="var(--color-white)"
                            />
                        </ClearButton>
                        {!isValid && <InputError>Not a valid address</InputError>}
                    </InputWrapper>
                    <ButtonGroup>
                        <CancelButton onClick={toggle}>Cancel</CancelButton>
                        <SecondaryButton
                            onClick={handleSubmit}
                            disabled={!isValid || !address}
                        >
                            Save Changes
                        </SecondaryButton>
                    </ButtonGroup>
                </Dialog>
            </section>
        </AnimatePresence>
    )
};

export default AddressSelection;