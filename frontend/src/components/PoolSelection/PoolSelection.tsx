import { FC, Dispatch, SetStateAction } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelect } from "downshift";

import { useBalances, useConnection } from "state/hooks";
import { formatUnits, TOKENS_LIST, ChainId, Token } from "utils";
import { SectionTitle } from "../Section";

import {
  RoundBox,
  Wrapper,
  Menu,
  Item,
  InputGroup,
  ToggleButton,
  Logo,
  ToggleIcon,
  MigrationWarning,
} from "./PoolSelection.styles";
import { migrationPoolV2Warning } from "utils";
import { ethers } from "ethers";
interface Props {
  token: Token;
  setToken: Dispatch<SetStateAction<Token>>;
  wrongNetwork?: boolean;
  position: ethers.BigNumber;
}

const PoolSelection: FC<Props> = ({ token, setToken, position }) => {
  const { account } = useConnection();

  const { data: balances } = useBalances(
    {
      account: account!,
      chainId: ChainId.MAINNET,
    },
    { skip: !account }
  );

  const {
    isOpen,
    selectedItem,
    getLabelProps,
    getToggleButtonProps,
    getItemProps,
    getMenuProps,
  } = useSelect({
    items: TOKENS_LIST[ChainId.MAINNET],
    defaultSelectedItem: token,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setToken(selectedItem);
      }
    },
  });

  return (
    <AnimatePresence>
      <Wrapper>
        {migrationPoolV2Warning ? (
          <MigrationWarning>
            <div>
              If you have not migrated liquidity from Across v1 to Across v2,
              please follow{" "}
              <a
                href="https://docs.across.to/v2/migrating-from-v1"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                these instructions
              </a>{" "}
            </div>
          </MigrationWarning>
        ) : null}
        <SectionTitle>Select pool</SectionTitle>
        <InputGroup>
          <RoundBox as="label" {...getLabelProps()}>
            <ToggleButton type="button" {...getToggleButtonProps()}>
              <Logo src={selectedItem?.logoURI} alt={selectedItem?.name} />
              <div>{selectedItem?.symbol}</div>
              <ToggleIcon />
            </ToggleButton>
          </RoundBox>
          <Menu {...getMenuProps()} isOpen={isOpen}>
            {isOpen &&
              TOKENS_LIST[ChainId.MAINNET].map((t, index) => {
                return (
                  <Item
                    {...getItemProps({ item: t, index })}
                    key={t.address}
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    exit={{ y: -10 }}
                  >
                    <Logo src={t.logoURI} alt={t.name} />
                    <div>{t.name}</div>
                    <div>
                      {balances && formatUnits(balances[index], t.decimals)}
                    </div>
                  </Item>
                );
              })}
          </Menu>
        </InputGroup>
      </Wrapper>
    </AnimatePresence>
  );
};

export default PoolSelection;
