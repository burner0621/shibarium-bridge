import assert from "assert";
import { clients } from "@uma/sdk";
import { ethers, Signer, BigNumberish, BigNumber } from "ethers";
import { toWeiSafe } from "./weiMath";

export const DEFAULT_GAS_PRICE = toWeiSafe(
  process.env.REACT_APP_DEFAULT_GAS_PRICE || "400",
  9
);
export const GAS_PRICE_BUFFER = toWeiSafe(
  process.env.REACT_APP_GAS_PRICE_BUFFER || "0",
  9
);
// Rounded up from a mainnet transaction sending eth gas limit
export const ADD_LIQUIDITY_ETH_GAS = ethers.BigNumber.from(100000);

export const DEFAULT_ADD_LIQUIDITY_ETH_GAS_ESTIMATE = estimateGas(
  ADD_LIQUIDITY_ETH_GAS,
  DEFAULT_GAS_PRICE,
  GAS_PRICE_BUFFER
);

export const UPDATE_GAS_INTERVAL_MS = parseInt(
  process.env.REACT_APP_UPDATE_GAS_INTERVAL_MS || "30000"
);

// for a dynamic gas estimation
export function estimateGas(
  gas,
  gasPriceWei,
  buffer = BigNumber.from("0")
) {
  return BigNumber.from(gas).mul(BigNumber.from(gasPriceWei).add(buffer));
}

// this could be replaced eventually with a better gas estimator
export async function getGasPrice(
  provider
) {
  const fees = await provider.getFeeData();
  return fees.maxFeePerGas || fees.gasPrice || (await provider.getGasPrice());
}

// calculate exact amount of gas needed for tx
export async function gasForAddEthLiquidity(
  signer,
  bridgeAddress,
  balance
) {
  return clients.bridgePool
    .connect(bridgeAddress, signer)
    .estimateGas.addLiquidity(balance, { value: balance });
}

// combine all gas values to get a good gas estimate
export async function estimateGasForAddEthLiquidity(
  signer,
  bridgeAddress,
  balance = BigNumber.from("1")
) {
  assert(signer.provider, "requires signer with provider");
  const gasPrice = await getGasPrice(signer.provider);
  const gas = await gasForAddEthLiquidity(signer, bridgeAddress, balance);
  return estimateGas(gas, gasPrice, GAS_PRICE_BUFFER);
}