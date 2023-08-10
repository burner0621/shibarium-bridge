import styled from "@emotion/styled";
import { COLORS } from "utils";

export const BaseButton = styled.button`
  --radius: 30px;
  border: none;
  background-color: inherit;
  cursor: pointer;
  padding: 12px;
  font-size: ${16 / 16}rem;
  border-radius: var(--radius);
  &:disabled {
    cursor: not-allowed;
    opacity: 0.25;
  }
`;

export const ConnectButtonStyle = styled(BaseButton)`
  position: relative;
  background: #df343a ;
  color: white;
  font-weight: bold;
  font-size: 16px;
  box-shadow: inset 0 -6px 0 rgba(0,0,0,.16);
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    border-radius: var(--radius);
    box-shadow: 0 0 120px hsla(${COLORS.primary[500]} / 0.25);
    transition: opacity 0.2s;
  }
  &:hover:not(:disabled) {
    background: #ca2221;
    &:after {
      opacity: 1;
    }
  }
`;
export const PrimaryButton = styled(BaseButton)`
  position: relative;
  background: linear-gradient(90.46deg,#df343a 4.07%,#bc3035 98.55%) ;
  color: white;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 2px;
  box-shadow: inset 0 -6px 0 rgba(0,0,0,.16);
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    border-radius: var(--radius);
    box-shadow: 0 0 120px hsla(${COLORS.primary[500]} / 0.25);
    transition: opacity 0.2s;
  }
  &:hover:not(:disabled) {
    background: #ca2221;
    &:after {
      opacity: 1;
    }
  }
`;
export const SecondaryButton = styled(BaseButton)`
  position: relative;
  background-color: var(--color-gray);
  color: var(--color-white);
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    border-radius: var(--radius);
    box-shadow: 0 0 16px hsla(${COLORS.gray[500]} / 0.55);
    transition: opacity 0.2s;
  }
  &:hover:not(:disabled) {
    &:after {
      opacity: 1;
    }
  }
`;

export const SecondaryButtonWithoutShadow = styled(SecondaryButton)`
  &:after {
    display: none;
  }
`;
