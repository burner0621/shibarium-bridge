import { useMatomo } from "@datapunt/matomo-tracker-react";
import { onboard } from "utils";
import { useEffect, useState, useRef } from "react";
import { useConnection, useETHBalance } from "state/hooks";
import {
  DEFAULT_FROM_CHAIN_ID,
  CHAINS,
  shortenAddress,
  formatEther,
} from "utils";

import {
  Wrapper,
  Account,
  Info,
  ConnectButton,
  UnsupportedNetwork,
  WalletModal,
  WalletModalHeader,
  WalletModalAccount,
  WalletModalChain,
  WalletModalDisconnect,
} from "./Wallet.styles";

import useClickOutsideModal from "hooks/useClickOutsideModal";

const { init, reset } = onboard;

const Wallet = () => {
  const { account, isConnected, chainId } = useConnection();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const { trackEvent } = useMatomo();
  useClickOutsideModal(modalRef, () => setIsOpen(false));

  // Note: this must be before early returns.
  useEffect(() => {
    if (!isConnected && isOpen) setIsOpen(false);
  }, [isConnected, isOpen]);

  const disconnectWallet = () => {
    setIsOpen(false);
    reset();
  };

  // Add Matomo helpers for connect/disconnect
  const initWithMatomo = () => {
    // Matomo track wallet connect
    // TODO: Eventually add address to `name` field
    trackEvent({ category: "wallet", action: "connect", name: "null" });
    init();
  };

  const disconnectWithMatomo = () => {
    // Matomo track wallet disconnect
    // TODO: Eventually add address to `name` field
    trackEvent({ category: "wallet", action: "disconnect", name: "null" });
    disconnectWallet();
  };

  const { data: balance } = useETHBalance(
    { account: account ?? "", chainId: chainId ?? DEFAULT_FROM_CHAIN_ID },
    { skip: !isConnected }
  );

  if (account && !isConnected && !chainId) {
    return (
      <UnsupportedNetwork>
        Unsupported network. Please change networks.
      </UnsupportedNetwork>
    );
  }

  if (!isConnected) {
    return (
      <ConnectButton onClick={initWithMatomo}>Connect Wallet</ConnectButton>
    );
  }

  return (
    <div ref={modalRef}>
      <Wrapper onClick={() => setIsOpen(!isOpen)}>
        <Info>
          <div>
            {formatEther(balance ?? "0")}{" "}
            {CHAINS[chainId ?? 1].nativeCurrency.symbol}
          </div>
          <div>{CHAINS[chainId ?? 1].name}</div>
        </Info>
        <Account>{shortenAddress(account ?? "")}</Account>
      </Wrapper>
      {isOpen && (
        <WalletModal>
          <WalletModalHeader>Connected</WalletModalHeader>
          <WalletModalAccount>{account}</WalletModalAccount>
          <WalletModalChain>{CHAINS[chainId ?? 1].name}</WalletModalChain>
          <WalletModalDisconnect onClick={() => disconnectWithMatomo()}>
            Disconnect
          </WalletModalDisconnect>
        </WalletModal>
      )}
    </div>
  );
};
export default Wallet;
