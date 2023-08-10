import { clients } from "@uma/sdk";
import { ethers } from "ethers";
import { useCallback } from "react";

export function useERC20(tokenAddress){
  const approve = useCallback(
    async ({ spender, amount, signer }) => {
      if (!signer) {
        return;
      }
      const token = clients.erc20.connect(tokenAddress, signer);
      const tx = await token.approve(spender, amount);
      return tx;
    },
    [tokenAddress]
  );

  const allowance = useCallback(
    async ({ spender, account, provider }) => {
      const token = clients.erc20.connect(tokenAddress, provider);
      return token.allowance(account, spender);
    },
    [tokenAddress]
  );

  return { approve, allowance };
}
