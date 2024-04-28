import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
    CHAINS,
    shortenAddress,
} from "../../utils";

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
import * as selectors from "../../store/selectors";
import { connectWallet, disconnect } from "../../Core/web3";

const Wallet = () => {
    const userWalletState = useSelector(selectors.userWallet);
    const web3 = useSelector(selectors.web3State);
    const pending = useSelector(selectors.loadingState);
    const chainId = useSelector(selectors.authChainID);

    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false)

    const onConnect = async () => {
        await connectWallet();
    };

    const onDisconnect = async () => {
        await disconnect();
    };

    return (
        <div ref={modalRef}>
            {
                chainId === "" || userWalletState === "" || userWalletState === 0 ? (
                    <ConnectButton onClick={onConnect}>Connect Wallet</ConnectButton>
                ) : (
                    <>
                        {
                            pending ? (
                                <ConnectButton onClick={() => console.log()}>Pending...</ConnectButton>
                            ) : (
                                // <Wrapper onClick={onDisconnect}>
                                //     <Info>
                                //         <div>
                                //             0
                                //             {CHAINS[1].nativeCurrency.symbol}
                                //         </div>
                                //         <div>{CHAINS[1].name}</div>
                                //     </Info>
                                //     <Account>{shortenAddress(userWalletState ?? "")}</Account>
                                // </Wrapper>
                                <ConnectButton onClick={onDisconnect}>
                                    {`Disconnect | ${shortenAddress(userWalletState ?? "")}`}
                                </ConnectButton>
                            )
                        }
                    </>

                )
            }
            {isOpen && (
                <WalletModal>
                    <WalletModalHeader>Connected</WalletModalHeader>
                    <WalletModalAccount>{userWalletState}</WalletModalAccount>
                    <WalletModalChain>{CHAINS[1].name}</WalletModalChain>
                    <WalletModalDisconnect onClick={() => console.log()}>
                        Disconnect
                    </WalletModalDisconnect>
                </WalletModal>
            )}
        </div>
    );
};
export default Wallet;