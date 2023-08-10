import { ChainId } from "./constants";

export class UnsupportedChainIdError extends Error {
  constructor(unsupportedChainId) {
    super();
    this.name = this.constructor.name;
    this.message = "Unsupported chain id: " + unsupportedChainId + ". Supported chains are: " + Object.values(ChainId).join(", ") + ".";
  }
}

export class ParsingError extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "Invalid number.";
  }
}

export class TransactionError extends Error {
  constructor(address, method, ...txArgs) {
    super();
    this.name = this.constructor.name;
    this.message = "Transaction to " + address + " calling " + method + " reverted with args: [" + txArgs + "]";
  }
}

export class FeeTooHighError extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "Fees are too high.";
  }
}

export class InsufficientLiquidityError extends Error {
  constructor(token) {
    super();
    this.name = this.constructor.name;
    this.message = "Insufficient liquidity for " + token + ".";
  }
}