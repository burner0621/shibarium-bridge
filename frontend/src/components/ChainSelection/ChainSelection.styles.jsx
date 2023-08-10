import styled from "@emotion/styled";
import { PrimaryButton } from "../Buttons";
import { RoundBox as UnstyledBox } from "../Box";
import { QUERIES, COLORS } from "utils";
import { ChevronDown } from "react-feather";
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
  @media ${QUERIES.tabletAndUp} {
    padding-top: 20px;
  }
`;

export const RoundBox = styled(UnstyledBox)`
  --color: var(--color-white);
  --outline-color: var(--color-primary);
  background-color: var(--color);
  display: block;
  padding: 10px;
  margin-right: auto;
  margin-left: auto;
  &:not(:first-of-type):focus-within {
    outline: var(--outline-color) solid 1px;
  }
`;

export const ConnectButton = styled(PrimaryButton)`
  margin-top: 16px;
`;

export const Logo = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
  margin-right: 5px;
`;

export const Menu = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding-top: 10px;
  transform: translateY(100%);
  box-shadow: 0px 160px 8px 8px hsla(${COLORS.gray[500]} / 0.2);
  list-style: none;
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  pointer-events: ${(props) => (props.isOpen ? "all" : "none")};
  outline: none;
  flex-direction: column;
  z-index: 10000;
  width: 95%;
  margin: 0 auto;
`;

export const Item = motion(styled.li`
  padding: 15px 10px;
  display: flex;
  cursor: pointer;
  background-color: var(--color-white);
  transition: background-color 100ms linear;

  &:first-of-type {
    border-radius: 16px 16px 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 16px 16px;
  }

  &:hover {
    background-color: var(--color-gray-100);
  }

  & > div:last-of-type {
    margin-left: 0.25rem;
    color: #2d2e33;
  }

  div {
    flex-basis: 15%;
  }

  span {
    color: #2d2e33;
    flex-basis: 75%;
    text-align: right;
    padding-right: 8px;
  }

  &.disabled {
    background-color: var(--color-white);
    color: rgba(255, 255, 255, 0.65);

    > * {
      opacity: 0.5;
    }
  }
`);

export const ToggleIcon = styled(ChevronDown)`
  width: 30px;
`;

export const ToggleButton = styled.button`
  --radius: 30px;
  width: 100%;
  color: var(--color-gray);
  padding: 0;
  margin: 0;
  font-size: inherit;
  background-color: inherit;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const InputGroup = styled.div`
  position: relative;
`;

export const ToggleChainName = styled.div`
  width: 85px;
  text-align: left;
`;

export const SendBlockedWarning = styled.div`
  z-index: 1000;
  display: flex;
  padding: 1rem 0;
  > div {
    text-align: center;
    border-radius: 5px;
    background-color: var(--color-error);
    color: var(--color-gray);
    width: 90%;
    height: 70px;
    margin: 0 auto;
    padding: 1rem 0.5rem;
    font-size: ${14 / 16}rem;
    line-height: ${19 / 16}rem;
  }
`;
