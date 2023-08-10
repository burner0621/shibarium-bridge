import { ethers } from "ethers";
import { CHAINS, ChainId } from "./constants";

export async function switchChain(
  provider,
  chainId
) {
  try {
    await provider.send("wallet_switchEthereumChain", [
      {
        chainId: ethers.utils.hexValue(chainId),
      },
    ]);
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await provider.send("wallet_addEthereumChain", [
          {
            chainId: ethers.utils.hexValue(chainId),
            chainName: CHAINS[chainId].name,
            rpcUrls: [CHAINS[chainId].rpcUrl],
            blockExplorerUrls: [CHAINS[chainId].explorerUrl],
            nativeCurrency: CHAINS[chainId].nativeCurrency,
          },
        ]);
      } catch (addError) {
        console.error(`Failed to add ${CHAINS[chainId].name}`);
      }
    } else {
      console.error(`Failed to switch to ${CHAINS[chainId].name}`);
    }
  }
}

export function isSupportedChainId(chainId) {
  return chainId;
}
