import React, { useState, useEffect } from "react";
import { XOctagon } from "react-feather";
import { useConnection, useSend } from "state/hooks";
import { CHAINS, shortenAddress, isValidAddress, ChainId } from "utils";
import { SectionTitle } from "../Section";
import Dialog from "../Dialog";
import { SecondaryButton } from "../Buttons";
import { CoinSelection } from "components";
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
import { useSelect } from "downshift";
import { CHAINS_SELECTION } from "utils/constants";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { actions } from "state/send";
import { AnimatePresence } from "framer-motion";

import { useMatomo } from "@datapunt/matomo-tracker-react";

const AddressSelection = () => {
  const { isConnected } = useConnection();
  const { toChain, toAddress, fromChain, setToAddress } = useSend();
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const sendState = useAppSelector((state) => state.send);

  const { trackEvent } = useMatomo();

  const {
    isOpen,
    selectedItem,
    getLabelProps,
    getToggleButtonProps,
    getItemProps,
    getMenuProps,
  } = useSelect({
    items: CHAINS_SELECTION,
    defaultSelectedItem: sendState.currentlySelectedToChain,
    selectedItem: sendState.currentlySelectedToChain,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        // Matomo track toChain selection
        trackEvent({
          category: "send",
          action: "setToChain",
          name: selectedItem.chainId.toString(),
        });

        const nextState = { ...sendState, toChain: selectedItem.chainId };
        dispatch(actions.toChain(nextState));
        dispatch(actions.updateSelectedToChain(selectedItem));
        const nsToChain = { ...sendState };
        if (selectedItem.chainId === ChainId.MAINNET) {
          nsToChain.fromChain = ChainId.OPTIMISM;
          dispatch(actions.fromChain(nsToChain));
          dispatch(actions.updateSelectedFromChain(CHAINS_SELECTION[0]));
        }
      }
    },
  });

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
  const clearInput = () => {
    setAddress("");
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(evt.target.value);
  };
  const isValid = !address || isValidAddress(address);
  const handleSubmit = () => {
    if (isValid && address) {
      setToAddress({ toAddress: address });
      toggle();
    }
  };

  const isL1toL2 = fromChain === ChainId.MAINNET;

  return (
    <AnimatePresence>
      <section  className="p-2.5">
        <Wrapper className="py-5 px-3 bg-[#ffddb3] rounded-3xl">
          <SectionTitle>To</SectionTitle>
          <div className="flex flex-row items-center justify-between">
          <InputGroup>
            <RoundBox as="label" {...getLabelProps()} className="rounded-full">
              <ToggleButton type="button" {...getToggleButtonProps()}>
                <Logo src={selectedItem?.logoURI} alt={selectedItem?.name} />
                  <ToggleChainName>
                    {selectedItem?.name === "Ether"
                      ? "Mainnet"
                      : selectedItem?.name}
                  </ToggleChainName>
                  {/* {toAddress && <Address>{shortenAddress(toAddress)}</Address>} */}
                <ToggleIcon />
              </ToggleButton>
            </RoundBox>
            <Menu isOpen={isOpen} {...getMenuProps()}>
              {isOpen &&
                sendState.currentlySelectedToChain.chainId !==
                  ChainId.MAINNET &&
                CHAINS_SELECTION.map((t, index) => {
                  return (
                    <Item
                      className={
                        t === sendState.currentlySelectedToChain ||
                        t.chainId === ChainId.MAINNET
                          ? "disabled"
                          : ""
                      }
                      {...getItemProps({ item: t, index })}
                      key={t.chainId}
                    >
                      <Logo src={t.logoURI} alt={t.name} />
                      <div>{t.name}</div>
                      {/* <span className="layer-type">
                        {t.chainId !== ChainId.MAINNET ? "L2" : "L1"}
                      </span> */}
                    </Item>
                  );
                })}
              {isOpen &&
                sendState.currentlySelectedToChain.chainId ===
                  ChainId.MAINNET && (
                  <>
                    {CHAINS_SELECTION.map((t, index) => {
                      return (
                        <Item
                          className={"disabled"}
                          {...getItemProps({ item: t, index })}
                          key={t.chainId}
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          exit={{ y: -10 }}
                        >
                          <Logo src={t.logoURI} alt={t.name} />
                          <div>{t.name}</div>
                          {/* <span className="layer-type">
                            {index !== CHAINS_SELECTION.length - 1
                              ? "L2"
                              : "L1"}
                          </span> */}
                        </Item>
                      );
                    })}
                  </>
                )}
            </Menu>
          </InputGroup>
          <CoinSelection />
          {/* {!isL1toL2 && (
            <ChangeWrapper onClick={toggle}>
              <ChangeButton className={!isConnected ? "disabled" : ""}>
                Change account
              </ChangeButton>
            </ChangeWrapper>
          )} */}
          </div>
        </Wrapper>
        <Dialog isOpen={open} onClose={toggle}>
          <h3>Send To</h3>
          <div>Address on {CHAINS[toChain].name}</div>
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
  );
};

export default AddressSelection;
