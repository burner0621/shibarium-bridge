import { ethers } from "ethers";

import ethereumLogo from "assets/ethereum-logo.svg";
import usdcLogo from "assets/usdc-logo.png";
import optimismLogo from "assets/optimism-alt-logo.svg";
import wethLogo from "assets/weth-logo.svg";
import arbitrumLogo from "assets/arbitrum-logo.svg";
import shibariumLogo from "assets/logo_web.png";
import boneLogo from "assets/bone.png";
import memoize from "lodash-es/memoize";
import umaLogo from "assets/UMA-round.svg";
import bobaLogo from "assets/Across-Boba-Color30x30.svg";
import badgerLogo from "assets/badger.svg";
import wbtcLogo from "assets/wbtc-logo.svg";
import daiLogo from "assets/dai-logo.svg";
import { getAddress } from "./address";

export const COLORS = {
    gray: {
        100: "0deg 0% 89%",
        200: "220deg 2% 72%",
        300: "240deg 4% 27%",
        400: "230deg 5% 23%",
        500: "230deg 6% 19%",
    },
    primary: {
        500: "166deg 92% 70%",
        700: "180deg 15% 25%",
    },
    secondary: {
        500: "266deg 77% 62%",
    },
    error: {
        500: "11deg 92% 70%",
        300: "11deg 93% 94%",
    },
    white: "0deg 100% 100%",
    black: "0deg 0% 0%",
    umaRed: "0deg 100% 65%",
    purple: "267deg 77% 62%",
    banner: "180deg 14.5% 22.9%",
};

export const BREAKPOINTS = {
    tabletMin: 550,
    laptopMin: 1100,
    desktopMin: 1500,
};

export const QUERIES = {
    tabletAndUp: `(min-width: ${BREAKPOINTS.tabletMin / 16}rem)`,
    laptopAndUp: `(min-width: ${BREAKPOINTS.laptopMin / 16}rem)`,
    desktopAndUp: `(min-width: ${BREAKPOINTS.desktopMin / 16}rem)`,
    tabletAndDown: `(max-width: ${(BREAKPOINTS.laptopMin - 1) / 16}rem)`,
    mobileAndDown: `(max-width: ${(BREAKPOINTS.tabletMin - 1) / 16}rem)`,
};

export const ChainId =  {
  MAINNET: 1,
  SHIBARIUM: 109,
}

export const MAX_RELAY_FEE_PERCENT = 25;

export const COLORS = {
  gray: {
    100: "0deg 0% 89%",
    200: "220deg 2% 72%",
    300: "240deg 4% 27%",
    400: "230deg 5% 23%",
    500: "230deg 6% 19%",
  },
  primary: {
    500: "166deg 92% 70%",
    700: "180deg 15% 25%",
  },
  secondary: {
    500: "266deg 77% 62%",
  },
  error: {
    500: "11deg 92% 70%",
    300: "11deg 93% 94%",
  },
  white: "0deg 100% 100%",
  black: "0deg 0% 0%",
  umaRed: "0deg 100% 65%",
  purple: "267deg 77% 62%",
  banner: "180deg 14.5% 22.9%",
};

/* Chains and Tokens section */

export const TOKENS_LIST = {
  [ChainId.MAINNET]: [
    {
      address: getAddress("0x9813037ee2218799597d83d4a5b6f3b6778218d9"),
      name: "BONE",
      symbol: "BONE",
      decimals: 18,
      logoURI: wethLogo,
      bridgePool: getAddress("0x885fce983b6a01633f764325b8c3c5d31032c995"),
    },
  ],
  [ChainId.SHIBARIUM]: [
    {
      address: ethers.constants.AddressZero,
      name: "BONE",
      symbol: "BONE",
      decimals: 18,
      logoURI: ethereumLogo,
      bridgePool: "",
    },
  ],
};

const defaultConstructExplorerLink =
    (explorerUrl) => (txHash) =>
        `${explorerUrl}/tx/${txHash}`;

export const CHAINS = {
  [ChainId.MAINNET]: {
    name: "Ethereum Mainnet",
    chainId: ChainId.MAINNET,
    logoURI: ethereumLogo,
    explorerUrl: "https://etherscan.io",
    constructExplorerLink: defaultConstructExplorerLink("https://etherscan.io"),
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  [ChainId.SHIBARIUM]: {
    name: "Shibarium Mainnet",
    chainId: ChainId.SHIBARIUM,
    logoURI: shibariumLogo,
    explorerUrl: "https://shibariumscan.io/",
    constructExplorerLink: defaultConstructExplorerLink(
      "https://shibariumscan.io/"
    ),
    nativeCurrency: {
      name: "BONE",
      symbol: "BONE",
      decimals: 18,
    },
  },
};

export const ADDRESSES = {
  [ChainId.MAINNET]: {
    // Stubbed value.
    BRIDGE: "0x885fce983b6a01633f764325b8c3c5d31032c995",
  },
  [ChainId.SHIBARIUM]: {
    BRIDGE: "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96",
  },
};

export const PROVIDERS = {
  [ChainId.MAINNET]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`
      )
  ),
  [ChainId.SHIBARIUM]: memoize(
    () =>
      new ethers.providers.StaticJsonRpcProvider(
        `https://www.shibrpc.com`
      )
  ),
};

export function getChainName(chainId) {
  switch (chainId) {
    case ChainId.MAINNET:
      return CHAINS[ChainId.MAINNET].name;
    case ChainId.SHIBARIUM:
      return CHAINS[ChainId.SHIBARIUM].name;
    default:
      return "unkwown";
  }
}

export const DEFAULT_FROM_CHAIN_ID = ChainId.SHIBARIUM;
export const DEFAULT_TO_CHAIN_ID = ChainId.MAINNET;

/* Onboard config */

export function onboardBaseConfig() {
  // const infuraRpc = PROVIDERS[DEFAULT_FROM_CHAIN_ID]().connection.url;
  return {
    dappId: process.env.REACT_APP_PUBLIC_ONBOARD_API_KEY || "",
    networkId: DEFAULT_FROM_CHAIN_ID,
    hideBranding: true,
    walletSelect: {
      wallets: [
        { walletName: "metamask", preferred: true },
        // disable wallet connect due to potential issue sending to dead address, will re-evaluate after bug finding.
        {
          walletName: "walletConnect",
          rpc: {
            1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_PUBLIC_INFURA_ID}`,
            109: `https://www.shibrpc.com/`,
          },
          preferred: true,
        },
    },
};

export const CHAINS_SELECTION = [
  {
    name: "Ethereum",
    chainId: ChainId.MAINNET,
    logoURI: ethereumLogo,
    // Doesn't have an RPC on Infura. Need to know how to handle this
    rpcUrl: "https://mainnet.infura.io/v3/",
    explorerUrl: "https://etherscan.io",
    constructExplorerLink: (txHash) =>
      `https://etherscan.io/tx/${txHash}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    name: "Shibarium",
    chainId: ChainId.SHIBARIUM,
    logoURI: shibariumLogo,
    rpcUrl: "https://www.shibrpc.com/",
    explorerUrl: "https://shibariumscan.io/",
    constructExplorerLink: (txHash) =>
      `https://shibariumscan.io//tx/${txHash}`,
    nativeCurrency: {
      name: "BONE",
      symbol: "BONE",
      decimals: 18,
    },
  },
];


export const TOKENS_LIST = {
    [ChainId.MAINNET]: [
        {
            address: getAddress("0x9813037ee2218799597d83d4a5b6f3b6778218d9"),
            name: "BONE",
            symbol: "BONE",
            decimals: 18,
            logoURI: boneLogo,
            bridgePool: getAddress("0x885fce983b6a01633f764325b8c3c5d31032c995"),
        },
    ],
    [ChainId.SHIBARIUM]: [
        {
            address: ethers.constants.AddressZero,
            name: "BONE",
            symbol: "BONE",
            decimals: 18,
            logoURI: boneLogo,
            bridgePool: "",
        },
    ],
};