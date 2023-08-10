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

    let { l1Token } = request.query;
    if (!isString(l1Token)) {
      throw new InputError("Must provide l1Token");
    }

    const checksumL1Token = ethers.utils.getAddress(l1Token);


    const bridgePool = BridgePoolEthers__factory.connect(
      (await getTokenDetails(provider, checksumL1Token)).bridgePool,
      provider
    );

    const multicallInput = [
      bridgePool.interface.encodeFunctionData("sync"),
      bridgePool.interface.encodeFunctionData("liquidReserves"),
      bridgePool.interface.encodeFunctionData("pendingReserves"),
    ];

    const [depositFeeDetails, multicallOutput] = await Promise.all([
      sdk.across.gasFeeCalculator.getDepositFeesDetails(
        provider,
        ethers.BigNumber.from("10").pow(18), // Just pass in 1e18
        checksumL1Token === sdk.across.constants.ADDRESSES.WETH
          ? sdk.across.constants.ADDRESSES.ETH
          : checksumL1Token
      ),
      bridgePool.callStatic.multicall(multicallInput),
    ]);

    const [liquidReserves] = bridgePool.interface.decodeFunctionResult(
      "liquidReserves",
      multicallOutput[1]
    );
    const [pendingReserves] = bridgePool.interface.decodeFunctionResult(
      "pendingReserves",
      multicallOutput[2]
    );

    const responseJson = {
      minDeposit: ethers.BigNumber.from(depositFeeDetails.slow.total)
        .add(depositFeeDetails.instant.total)
        .mul(4)
        .toString(), // Max fee pct is 25%
      maxDeposit: liquidReserves.sub(pendingReserves).toString(),
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
