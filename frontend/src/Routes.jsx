import { FC, useContext } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { Send, Confirmation, Pool, About } from "views";
import { Header, SuperHeader } from "components";
import { useConnection, useDeposits } from "state/hooks";
import {
  DEFAULT_TO_CHAIN_ID,
  CHAINS,
  UnsupportedChainIdError,
  switchChain,
  showMigrationBanner,
} from "utils";

import { useAppSelector } from "state/hooks";
import { ErrorContext } from "context/ErrorContext";
import styled from "@emotion/styled";
import { Banner } from "components/SuperHeader/SuperHeader";


// Need this component for useLocation hook
const Routes = () => {
  const { showConfirmationScreen } = useDeposits();
  const { error, provider, chainId } = useConnection();
  const location = useLocation();
  const sendState = useAppSelector((state) => state.send);
  const { error: globalError, removeError } = useContext(ErrorContext);

  const wrongNetworkSend =
    provider &&
    chainId &&
    (error instanceof UnsupportedChainIdError ||
      chainId !== sendState.currentlySelectedFromChain.chainId);
  const wrongNetworkPool =
    provider &&
    (error instanceof UnsupportedChainIdError ||
      chainId !== DEFAULT_TO_CHAIN_ID);
  return (
    <div className="bg-[url('/images/background.png')] bg-cover h-full">
      {showMigrationBanner && (
        <Banner>
          <div>
            Across v2 is here!{" "}
            <a
              href="https://medium.com/across-protocol/lps-migrate-liquidity-from-v1-to-v2-screenshots-and-faqs-8616150b3396"
              target="_blank"
              rel="noreferrer"
            >
              Read here
            </a>{" "}
            to learn how to migrate your pool liquidity from Across v1.
          </div>
        </Banner>
      )}
      {globalError && (
        <SuperHeader>
          <div>{globalError}</div>
          <RemoveErrorSpan onClick={() => removeError()}>X</RemoveErrorSpan>
        </SuperHeader>
      )}
      {wrongNetworkSend && location.pathname === "/" && (
        <SuperHeader>
          <div>
            You are on an incorrect network. Please{" "}
            <button
              onClick={() =>
                switchChain(
                  provider,
                  sendState.currentlySelectedFromChain.chainId
                )
              }
            >
              switch to{" "}
              {CHAINS[sendState.currentlySelectedFromChain.chainId].name}
            </button>
          </div>
        </SuperHeader>
      )}

      {wrongNetworkPool && location.pathname === "/pool" && (
        <SuperHeader>
          <div>
            You are on an incorrect network. Please{" "}
            <button onClick={() => switchChain(provider, DEFAULT_TO_CHAIN_ID)}>
              switch to {CHAINS[DEFAULT_TO_CHAIN_ID].name}
            </button>
          </div>
        </SuperHeader>
      )}
      <Header />
      <Switch>
        <Route exact path="/about" component={About} />
        <Route
          exact
          path="/"
          component={showConfirmationScreen ? Confirmation : Send}
        />
      </Switch>
    </div>
  );
};

export default Routes;

const RemoveErrorSpan = styled.span`
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
`;
