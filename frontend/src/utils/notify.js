export function addEtherscan(transaction) {
  return {
    link: `https://etherscan.io/tx/${transaction.hash}`,
  };
}
