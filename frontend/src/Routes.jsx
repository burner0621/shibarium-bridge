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
      <Header />
      {/* <Switch>
        <Route exact path="/about" component={About} />
        <Route
          exact
          path="/"
          component={Send}
        />
      </Switch> */}
    </div>
  );
};

export default Routes;

const RemoveErrorSpan = styled.span`
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
`;
