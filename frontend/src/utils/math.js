import { BigNumber } from "ethers";

export function max(a, b) {
  if (BigNumber.from(a).gte(b)) return BigNumber.from(a);
  return BigNumber.from(b);
}

export function receiveAmount(amount, fees) {
  const amountBn = BigNumber.from(amount);
  if (amountBn.lte(0)) return BigNumber.from(0);
  if (!fees) return amountBn;
  return max(
    amountBn
      .sub(fees.instantRelayFee.total)
      .sub(fees.slowRelayFee.total)
      .sub(fees.lpFee.total),
    0
  );
}
