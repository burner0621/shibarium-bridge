// Note: ideally this would be written in ts as vercel claims they support it natively.
// However, when written in ts, the imports seem to fail, so this is in js for now.

const sdk = require("@uma/sdk");
const { BridgePoolEthers__factory } = require("@uma/contracts-node");
const ethers = require("ethers");

const { getTokenDetails, InputError, isString } = require("./utils");

const handler = async (request, response) => {
  try {
    const { REACT_APP_PUBLIC_INFURA_ID } = process.env;
    const provider = new ethers.providers.StaticJsonRpcProvider(
      `https://mainnet.infura.io/v3/${REACT_APP_PUBLIC_INFURA_ID}`
    );

    let { amount, l2Token, chainId, timestamp } = request.query;
    if (!isString(amount) || !isString(l2Token) || !isString(chainId))
      throw new InputError(
        "Must provide amount, chainId, and l2Token as query params"
      );
    const parsedTimestamp = isString(timestamp)
      ? Number(timestamp)
      : (await provider.getBlock("latest")).timestamp;

    let { l1Token, bridgePool } = await getTokenDetails(
      provider,
      undefined, // Search by l2Token only.
      l2Token,
      chainId
    );
    if (l1Token === sdk.across.constants.ADDRESSES.WETH)
      l1Token = sdk.across.constants.ADDRESSES.WETH;
    const lpFeeCalculator = new sdk.across.LpFeeCalculator(provider);

    const [depositFeeDetails, lpFee] = await Promise.all([
      sdk.across.gasFeeCalculator.getDepositFeesDetails(
        provider,
        amount,
        l1Token === sdk.across.constants.ADDRESSES.WETH
          ? sdk.across.constants.ADDRESSES.ETH
          : l1Token
      ),
      lpFeeCalculator.getLpFeePct(l1Token, bridgePool, amount, parsedTimestamp),
    ]);
    if (depositFeeDetails.isAmountTooLow)
      throw new InputError("Sent amount is too low relative to fees");

    const responseJson = {
      slowFeePct: depositFeeDetails.slow.pct,
      instantFeePct: depositFeeDetails.instant.pct,
      lpFeePct: lpFee.toString(),
      timestamp: parsedTimestamp.toString(),
    };

    response.status(200).json(responseJson);
  } catch (error) {
    let status;
    if (error instanceof InputError) {
      status = 400;
    } else {
      status = 500;
    }
    response.status(status).send(error.message);
  }
};

module.exports = handler;
