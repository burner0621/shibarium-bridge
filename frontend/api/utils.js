const { BridgeAdminEthers__factory } = require("@uma/contracts-node");

const getTokenDetails = async (provider, l1Token, l2Token, chainId) => {
  const bridgeAdmin = BridgeAdminEthers__factory.connect(
    "0x30B44C676A05F1264d1dE9cC31dB5F2A945186b6",
    provider
  );

  // 2 queries: treating the token as the l1Token or treating the token as the L2 token.
  const l2TokenFilter = bridgeAdmin.filters.WhitelistToken(
    undefined,
    l1Token,
    l2Token
  );

  // Filter events by chainId.
  const events = (
    await bridgeAdmin.queryFilter(l2TokenFilter, 0, "latest")
  ).filter((event) => !chainId || event.args.chainId.toString() === chainId);

  if (events.length === 0) throw new InputError("No whitelisted token found");

  // Sorting from most recent to oldest.
  events.sort((a, b) => {
    if (b.blockNumber !== a.blockNumber) return b.blockNumber - a.blockNumber;
    if (b.transactionIndex !== a.transactionIndex)
      return b.transactionIndex - a.transactionIndex;
    return b.logIndex - a.logIndex;
  });

  const event = events[0];

  return event.args;
};

const isString = (input) => typeof input === "string";

class InputError extends Error {}

module.exports = { getTokenDetails, isString, InputError };
