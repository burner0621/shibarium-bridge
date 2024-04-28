import styled from "@emotion/styled";
import { QUERIES } from "../../utils";
import { RoundBox } from "../Box";
import { ConnectButtonStyle } from "../Buttons";

export const Wrapper = styled(RoundBox)`
  background-color: inherit;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0;
  &:hover {
    cursor: pointer;
  }
`;

export const ConnectButton = styled(ConnectButtonStyle)`
  padding: 6px 16px 12px;
  border: 1px solid transparent;
  @media (max-width: 500px) {
    font-size: 12px;
    padding: 3px 12px 6px;
  }
`;

export const Account = styled.div`
  background-color: #df343a;
  color: var(--color-white);
  display: grid;
  place-items: center;
  padding: 0 10px;
  border-radius: 0 30px 30px 0;
  border: none;
  @media ${QUERIES.tabletAndUp} {
    padding: 0 30px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-transform: capitalize;
  border-radius: 30px 0 0 30px;
  border: 1px solid #df343a;
  padding: 5px 10px;
  white-space: nowrap;
  & > div {
    line-height: 1;
  }
  & > div:last-of-type {
    color: var(--color-gray-300);
    font-size: ${14 / 16}rem;
  }
  @media ${QUERIES.tabletAndUp} {
    padding: 10px 20px 5px;
  }
`;

export const UnsupportedNetwork = styled.div`
  background-color: rgba(45, 46, 51, 0.25);
  padding: 1rem 0.5rem;
`;

export const WalletModal = styled.div`
  position: absolute;
  background: var(--color-white);
  border-radius: 16px;
  min-height: 100px;
  width: 300px;
  margin-top: 4px;
  margin-left: 4px;
  padding: 1rem;
  z-index: 10000;
`;

export const WalletModalHeader = styled.h3`
  font-size: ${14 / 16}rem;
  font-weight: 700;
  text-indent: 2px;
`;

export const WalletModalAccount = styled.div`
  font-size: ${12 / 16}rem;
  text-indent: 2px;
`;

export const WalletModalChain = styled.div`
  text-indent: 2px;
  font-size: ${12 / 16}rem;
  border-bottom: 1px solid var(--color-gray-transparent);
  padding-bottom: 0.5rem;
`;

export const WalletModalDisconnect = styled.div`
  font-size: ${14 / 16}rem;
  text-indent: 2px;
  margin-top: 4px;
  color: var(--color-secondary);
  cursor: pointer;
`;
