import React, { useMemo, useState, useContext } from "react";
import {
  useConnection,
  useDeposits,
  useSend,
  useTransactions,
  useAllowance,
} from "state/hooks";
import { TransactionTypes } from "state/transactions";
import {
  CHAINS,
  TOKENS_LIST,
  formatUnits,
  receiveAmount,
  getEstimatedDepositTime,
  ChainId,
  disableSendForm,
} from "utils";
import { PrimaryButton } from "../Buttons";
import {
  Wrapper,
  Info,
  AccentSection,
  L1Info,
  InfoContainer,
  AmountToReceive,
  InfoHeadlineContainer,
  FeesButton,
  SlippageDisclaimer,
  WalletConnectWarning,
} from "./SendAction.styles";
import api from "state/chainApi";
import InformationDialog from "components/InformationDialog";
import { useAppSelector } from "state/hooks";
import { ErrorContext } from "context/ErrorContext";
import { ReactComponent as ConfettiIcon } from "assets/confetti.svg";
import { useMatomo } from "@datapunt/matomo-tracker-react";

const CONFIRMATIONS = 1;
const SendAction = () => {
  const {
    amount,
    token,
    send,
    hasToApprove,
    canApprove,
    canSend,
    toAddress,
    approve,
    fees,
    spender,
  } = useSend();
  const { signer, account, name } = useConnection();
  const sendState = useAppSelector((state) => state.send);
  const [isInfoModalOpen, setOpenInfoModal] = useState(false);
  const toggleInfoModal = () => setOpenInfoModal((oldOpen) => !oldOpen);
  const [isSendPending, setSendPending] = useState(false);
  const [isApprovalPending, setApprovalPending] = useState(false);
  const { addTransaction } = useTransactions();
  const { addDeposit } = useDeposits();
  const [updateEthBalance] = api.endpoints.ethBalance.useLazyQuery();
  const { trackEvent } = useMatomo();
  // trigger balance update
  const [updateBalances] = api.endpoints.balances.useLazyQuery();
  const tokenInfo = TOKENS_LIST[
    sendState.currentlySelectedFromChain.chainId
  ].find((t) => t.address === token);
  const { error, addError, removeError } = useContext(ErrorContext);
  const { refetch } = useAllowance(
    {
      owner: account, // account!
      spender,
      chainId: sendState.currentlySelectedFromChain.chainId,
      token,
      amount,
    },
    { skip: !account }
  );
  const handleApprove = async () => {
    const tx = await approve();
    if (tx) {
      addTransaction({ ...tx, meta: { label: TransactionTypes.APPROVE } });
      await tx.wait(CONFIRMATIONS);
      refetch();
    }
  };

  const handleSend = async () => {
    const { tx, fees } = await send();
    if (tx && fees) {
      addTransaction({ ...tx, meta: { label: TransactionTypes.DEPOSIT } });
      const receipt = await tx.wait(CONFIRMATIONS);
      addDeposit({
        tx: receipt,
        toChain: sendState.currentlySelectedToChain.chainId,
        fromChain: sendState.currentlySelectedFromChain.chainId,
        amount,
        token,
        toAddress,
        fees,
      });
      // update balances after tx
      if (account) {
        updateEthBalance({
          chainId: sendState.currentlySelectedFromChain.chainId,
          account,
        });
        updateBalances({
          chainId: sendState.currentlySelectedFromChain.chainId,
          account,
        });
      }
    }
  };
  const handleClick = () => {
    if (amount.lte(0) || !signer || disableSendForm) {
      return;
    }
    if (hasToApprove) {
      setApprovalPending(true);
      handleApprove()
        .catch((err) => {
          addError(new Error(`Error in approve call: ${err.message}`));
          console.error(err);
        })
        .finally(() => setApprovalPending(false));
      return;
    }
    if (canSend) {
      // Matomo track send transactions
      trackEvent({
        category: "send",
        action: "bridge",
        name:
          tokenInfo &&
          JSON.stringify({
            symbol: tokenInfo.symbol,
            from: sendState.currentlySelectedFromChain.chainId,
            to: sendState.currentlySelectedToChain.chainId,
          }),
        value: tokenInfo && Number(formatUnits(amount, tokenInfo.decimals)),
      });
      setSendPending(true);
      if (error) removeError();
      handleSend()
        .catch((err) => {
          addError(new Error(`Error with send call: ${err.message}`));
          console.error(err);
        })
        // this actually happens after component unmounts, which is not good. it causes a react warning, but we need
        // it here if user cancels the send. so keep this until theres a better way.
        .finally(() => setSendPending(false));
    }
  };

  const buttonMsg = () => {
    if (isSendPending) return "Sending in progress...";
    if (isApprovalPending) return "Approval in progress...";
    if (hasToApprove) return "Approve";
    return "SEND";
  };
  const amountMinusFees = useMemo(() => {
    if (sendState.currentlySelectedFromChain.chainId === ChainId.MAINNET) {
      return amount;
    }
    return receiveAmount(amount, fees);
  }, [amount, fees, sendState.currentlySelectedFromChain.chainId]);

  const buttonDisabled =
    isSendPending ||
    isApprovalPending ||
    (!hasToApprove && !canSend) ||
    (hasToApprove && !canApprove) ||
    amountMinusFees.lte(0);

  const isWETH = tokenInfo?.symbol === "WETH";

  return (
    <AccentSection className="rounded-b-2xl bg-[#ffd091]">
      <Wrapper>
        {amount.gt(0) && fees && tokenInfo && (
          <>
            <InfoHeadlineContainer>
              <SlippageDisclaimer>
                <ConfettiIcon />
                All transfers are slippage free!
              </SlippageDisclaimer>
              <FeesButton onClick={toggleInfoModal}>Fees info</FeesButton>
            </InfoHeadlineContainer>
            <InfoContainer>
              <Info>
                {`Time to ${
                  CHAINS[sendState.currentlySelectedToChain.chainId].name
                }`}
                <div>
                  {getEstimatedDepositTime(
                    sendState.currentlySelectedToChain.chainId
                  )}
                </div>
              </Info>
              {sendState.currentlySelectedFromChain.chainId !==
                ChainId.MAINNET && (
                <Info>
                  <div>Ethereum Network Gas</div>
                  <div>
                    {formatUnits(
                      fees.instantRelayFee.total.add(fees.slowRelayFee.total),
                      tokenInfo.decimals
                    )}{" "}
                    {tokenInfo.symbol}
                  </div>
                </Info>
              )}
              <Info>
                <div>
                  {sendState.currentlySelectedFromChain.chainId ===
                  ChainId.MAINNET
                    ? "Native Bridge Fee"
                    : "Across Bridge Fee"}
                </div>
                <div>
                  {sendState.currentlySelectedFromChain.chainId ===
                  ChainId.MAINNET
                    ? "Free"
                    : `${formatUnits(fees.lpFee.total, tokenInfo.decimals)}
                  ${tokenInfo.symbol}`}
                </div>
              </Info>
            </InfoContainer>
            <AmountToReceive>
              You will receive
              <span>
                {formatUnits(amountMinusFees, tokenInfo.decimals)}{" "}
                {isWETH ? "ETH" : tokenInfo.symbol}
              </span>
            </AmountToReceive>
          </>
        )}

        <PrimaryButton
          onClick={handleClick}
          disabled={buttonDisabled || !!disableSendForm}
        >
          <span>{buttonMsg()}</span>
        </PrimaryButton>
        {name && name === "WalletConnect" && (
          <WalletConnectWarning>
            <span>
              Do not change networks after connecting to Across with
              WalletConnect. Across is not responsible for wallet-based
              integration issues with WalletConnect.
            </span>
          </WalletConnectWarning>
        )}

        {sendState.currentlySelectedFromChain.chainId === ChainId.MAINNET && (
          <L1Info>
            <div>L1 to L2 transfers use the destination’s native bridge</div>
          </L1Info>
        )}
      </Wrapper>
      <InformationDialog isOpen={isInfoModalOpen} onClose={toggleInfoModal} />
    </AccentSection>
  );
};

export default SendAction;
