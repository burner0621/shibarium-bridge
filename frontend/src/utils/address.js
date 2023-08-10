import { ethers, Signer } from "ethers";
import { ChainId, PROVIDERS } from "./constants";

export function isValidAddress(address: string) {
  return ethers.utils.isAddress(address);
}

export function getAddress(address: string) {
  return ethers.utils.getAddress(address);
}

export async function validateContractAndChain(
  contractAddress: string,
  expectedChainId: ChainId,
  signer: Signer
): Promise<boolean> {
  if ((await signer.getChainId()) !== expectedChainId) {
    console.error("Signer chainId and intended chainId do not match");
    return false;
  }
  const codeAtAddress = await PROVIDERS[expectedChainId]().getCode(
    contractAddress
  );
  if (!codeAtAddress || codeAtAddress === "0x" || codeAtAddress === "0x0") {
    console.error(
      `No code at ${contractAddress} on chainId ${expectedChainId}`
    );
    return false;
  }

  return true;
}
