import React, { useEffect, useMemo, useState } from "react";
import { ethers, BigNumber } from "ethers";
import { useSelect } from "downshift";
import { ChainId, max } from "utils";

import { useSend, useBalances, useConnection } from "state/hooks";
import {
  parseUnits,
  formatUnits,
  ParsingError,
  TOKENS_LIST,
} from "utils";
import { Section, SectionTitle } from "../Section";
import { useAppSelector } from "state/hooks";

import {
  RoundBox,
  Wrapper,
  Menu,
  Item,
  InputGroup,
  ToggleButton,
  Logo,
  ToggleIcon,
  MaxButton,
  Input,
  ErrorBox,
} from "./CoinSelection.styles";
import { AnimatePresence } from "framer-motion";

// Matomo import
import { useMatomo } from "@datapunt/matomo-tracker-react";

const FEE_ESTIMATION = ".004";
const CoinSelection = () => {
  const { account, isConnected } = useConnection();
  const { setAmount, setToken, amount, token, fees } = useSend();

  const { trackEvent } = useMatomo();

  const [error, setError] = React.useState();
  const sendState = useAppSelector((state) => state.send);
  const tokenList = useMemo(() => {
    const filterByToChain = (token) =>
      TOKENS_LIST[sendState.currentlySelectedToChain.chainId].some(
        (element) => element.symbol === token.symbol
      );
    if (
      sendState.currentlySelectedFromChain.chainId === ChainId.MAINNET &&
      sendState.currentlySelectedToChain.chainId === ChainId.OPTIMISM
    ) {
      // Note: because of how Optimism treats WETH, it must not be sent over their canonical bridge.
      return TOKENS_LIST[sendState.currentlySelectedFromChain.chainId]
        .filter((element) => element.symbol !== "WETH")
        .filter(filterByToChain);
    }
    return TOKENS_LIST[sendState.currentlySelectedFromChain.chainId].filter(
      filterByToChain
    );
  }, [
    sendState.currentlySelectedFromChain.chainId,
    sendState.currentlySelectedToChain.chainId,
  ]);
  const { data: balances } = useBalances(
    {
      account: account,
      chainId: sendState.currentlySelectedFromChain.chainId,
    },
    { skip: !account }
  );
  const tokenBalanceMap = useMemo(() => {
    return TOKENS_LIST[sendState.currentlySelectedFromChain.chainId].reduce(
      (acc, val, idx) => {
        return {
          ...acc,
          [val.address]: balances ? balances[idx] : undefined,
        };
      },
      {}
    );
  }, [balances, sendState.currentlySelectedFromChain.chainId]);

  const [dropdownItem, setDropdownItem] = useState(() =>
    tokenList.find((t) => t.address === token)
  );

  // Adjust coin dropdown when chain id changes, as some tokens don't exist on all chains.
  useEffect(() => {
    const newToken = tokenList.find(
      (t) => t.address === ethers.constants.AddressZero
    );
    setInputAmount("");
    // since we are resetting input to 0, reset any errors
    setError(undefined);
    setAmount({ amount: BigNumber.from("0") });
    setDropdownItem(() => newToken);
    setToken({ token: newToken?.address || "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendState.currentlySelectedFromChain.chainId, tokenList]);

  const {
    isOpen,
    selectedItem,
    getLabelProps,
    getToggleButtonProps,
    getItemProps,
    getMenuProps,
  } = useSelect({
    items: tokenList,
    defaultSelectedItem: tokenList.find((t) => t.address === token),
    selectedItem: dropdownItem,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        // Matomo track token selection
        trackEvent({
          category: "send",
          action: "setAsset",
          name: selectedItem.symbol,
        });

        setInputAmount("");
        // since we are resetting input to 0, reset any errors
        setError(undefined);
        setAmount({ amount: BigNumber.from("0") });
        setToken({ token: selectedItem.address });
        setDropdownItem(selectedItem);
      }
    },
  });
  const [inputAmount, setInputAmount] = React.useState(
    selectedItem && amount.gt("0")
      ? formatUnits(amount, selectedItem.decimals)
      : ""
  );

  const handleChange = (event) => {
    const value = event.target.value;
    setInputAmount(value);
    if (value === "") {
      setAmount({ amount: ethers.constants.Zero });
      setError(undefined);
      return;
    }
    try {
      const amount = parseUnits(value, selectedItem?.decimals);
      // just throw an error if lt 0 and let the catch set the parsing error
      if (amount.lt(0)) throw new Error();
      setAmount({ amount });
      if (error instanceof ParsingError) {
        setError(undefined);
      }
    } catch (e) {
      setError(new ParsingError());
    }
  };

  // checks for insufficient balance errors
  useEffect(() => {
    if (amount && inputAmount) {
      // clear the previous error if it is not a parsing error
      setError((oldError) => {
        if (oldError instanceof ParsingError) {
          return oldError;
        }
        return undefined;
      });

      if (balances && amount.gt(0)) {
        const selectedIndex = tokenList.findIndex(
          ({ address }) => address === token
        );
        const balance = tokenBalanceMap[token];
        const isEth = tokenList[selectedIndex]?.symbol === "ETH";
        if (
          balance &&
          amount.gt(
            isEth
              ? balance.sub(ethers.utils.parseEther(FEE_ESTIMATION))
              : balance
          )
        ) {
          setError(new Error("Insufficient balance."));
        }
      }
    }
  }, [balances, amount, token, tokenList, inputAmount, tokenBalanceMap]);

  const handleMaxClick = () => {
    if (balances && selectedItem) {
      const selectedIndex = tokenList.findIndex(
        ({ address }) => address === selectedItem.address
      );
      const isEth = tokenList[selectedIndex].symbol === "ETH";
      let balance = tokenBalanceMap[token];

      if (balance) {
        if (isEth) {
          balance = max(
            balance.sub(ethers.utils.parseEther(FEE_ESTIMATION)),
            0
          );
        }
        setAmount({ amount: balance });
        setInputAmount(formatUnits(balance, selectedItem.decimals));
      } else {
        setAmount({ amount: ethers.BigNumber.from("0") });
        setInputAmount(
          formatUnits(ethers.BigNumber.from("0"), selectedItem.decimals)
        );
      }
    }
  };
  const errorMsg = error
    ? error.message
    : fees?.isAmountTooLow
    ? "Bridge fee is high for this amount. Send a larger amount."
    : fees?.isLiquidityInsufficient
    ? `Insufficient liquidity for ${selectedItem?.symbol}.`
    : undefined;

  const showError =
    error ||
    (fees?.isAmountTooLow && amount.gt(0)) ||
    (fees?.isLiquidityInsufficient && amount.gt(0));

  return (
    <AnimatePresence>
      <section className="text-white px-0 pl-2.5">
        <Wrapper>
          {/* <SectionTitle>Asset</SectionTitle> */}
          <InputGroup>
            <RoundBox
              as="label"
              htmlFor="amount"
              style={{
                // @ts-expect-error TS does not likes custom CSS vars
                "--color": error
                  ? "var(--color-error-light)"
                  : "var(--color-white)",
                "--outline-color": error
                  ? "var(--color-error)"
                  : "var(--color-primary)",
              }}
              className="pr-0 mr-0 rounded-tl-full rounded-bl-full"
            >
              <MaxButton onClick={handleMaxClick} disabled={!isConnected}>
                max
              </MaxButton>
              <Input
                placeholder="0.00"
                id="amount"
                value={inputAmount}
                onChange={handleChange}
              />
            </RoundBox>
            <RoundBox as="label" {...getLabelProps()} className="rounded-tr-full rounded-br-full px-[5px]">
              <ToggleButton type="button" {...getToggleButtonProps()}>
                <Logo src={selectedItem?.logoURI} alt={selectedItem?.name} />
                <div>{selectedItem?.symbol}</div>
                <ToggleIcon />
              </ToggleButton>
            </RoundBox>
            <Menu {...getMenuProps()} isOpen={isOpen}>
              {isOpen &&
                tokenList.map((token, index) => (
                  <Item
                    {...getItemProps({ item: token, index })}
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    exit={{ y: -10 }}
                    key={token.address}
                  >
                    <Logo src={token.logoURI} alt={token.name} />
                    <div>{token.name}</div>
                    <div>
                      {tokenBalanceMap &&
                        formatUnits(
                          tokenBalanceMap[token.address] || "0",
                          tokenList[index].decimals
                        )}
                    </div>
                  </Item>
                ))}
            </Menu>
          </InputGroup>
          {showError && <ErrorBox>{errorMsg}</ErrorBox>}
        </Wrapper>
      </section>
    </AnimatePresence>
  );
};

export default CoinSelection;
