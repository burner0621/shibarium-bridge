import { ethers, Signer } from "ethers";
import { ChainId, PROVIDERS } from "./constants";

export function isValidAddress(address) {
  return ethers.utils.isAddress(address);
}

export function getAddress(address) {
  return ethers.utils.getAddress(address);
}
