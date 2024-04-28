import Web3Modal from 'web3modal';
import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from 'ethers';
import { config } from "./config";
import { CHAINS_SELECTION, ChainId } from "../utils"
import store from "../store";
import { setChainID, setWalletAddr, setBalance, setWeb3, setBridgeBalance } from '../store/actions';
import { parseErrorMsg } from '../components/utils';
const BridgeABI = config.bridgeAbi;
const BridgeAddress = config.bridgeAddress;
const BoneAddress = config.boneAddress;
const BoneABI = config.boneAbi;

const mainChain = CHAINS_SELECTION.filter((a) => a.chainId === ChainId.MAINNET)[0]
const shibaChain = CHAINS_SELECTION.filter((a) => a.chainId === ChainId.SHIBARIUM)[0]

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          // infuraId: mainChain.rpcUrl, // required
          rpc: {
            1: mainChain.rpcUrl,
          },
          chainId: 1
        },
      },
    }, // required
    theme: "dark",
  });
}

export let provider = null;
export let web3Provider = null;

export const loadWeb3 = async () => {
  try {
    let web3 = new Web3(mainChain.rpcUrl);
    store.dispatch(setWeb3(web3));

    provider = await web3Modal.connect();
    web3 = new Web3(provider);
    store.dispatch(setWeb3(web3));

    web3Provider = new providers.Web3Provider(provider);
    const network = await web3Provider.getNetwork();
    store.dispatch(setChainID(network.chainId));

    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();
    store.dispatch(setWalletAddr(account));

    const balRes = await getBalanceOfAccount();
    if (balRes.success) {
      store.dispatch(setBalance(balRes.totalBoneBalance));
    }
    provider.on("accountsChanged", async function (accounts) {
      if (accounts[0] !== undefined) {
        store.dispatch(setWalletAddr(accounts[0]));
        const balRes = await getBalanceOfAccount();
        if (balRes.success) {
          store.dispatch(setBalance(balRes.totalBoneBalance));
        }
      } else {
        store.dispatch(setWalletAddr(''));
      }
    });

    provider.on('chainChanged', function (chainId) {
      store.dispatch(setChainID(chainId));
    });

    provider.on('disconnect', function (error) {
      store.dispatch(setWalletAddr(''));
    });
  } catch (error) {
    console.log('[Load Web3 error] = ', error);
  }
}

export const disconnect = async () => {
  await web3Modal.clearCachedProvider();
  const web3 = new Web3(mainChain.rpcUrl);
  store.dispatch(setWeb3(web3));
  store.dispatch(setChainID(''));
  store.dispatch(setWalletAddr(''));
  store.dispatch(setBalance({
    avaxBalance: '',
    usdcBalance: '',
    magicBalance: ''
  }));
}

export const checkNetwork = async () => {
  if (web3Provider) {
    const network = await web3Provider.getNetwork();
    store.dispatch(setChainID(network.chainId));
    return checkNetworkById(network.chainId);
  }
}

export const checkNetworkById = async (chainId) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  if (web3.utils.toHex(chainId) !== web3.utils.toHex(mainChain.chainId)) {
    await changeNetwork();
    return false;
  } else {
    return true;
  }
}

export const setBridgeValue = (bridgeBalance) => {
  if (web3Provider) {
    store.dispatch(setBridgeBalance(bridgeBalance));
  }
}

const changeNetwork = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: web3.utils.toHex(mainChain.chainId) }],
    });
    await getBalanceOfAccount();
  }
  catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: web3.utils.toHex(mainChain.chainId),
              chainName: 'Ethereum',
              rpcUrls: [mainChain.rpcUrl] /* ... */,
            },
          ],
        });
        return {
          success: true,
          message: "switching succeed"
        }
      } catch (addError) {
        return {
          success: false,
          message: "Switching failed." + addError.message
        }
      }
    }
  }
}

export const connectWallet = async () => {
  try {
    provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    store.dispatch(setWeb3(web3));
    web3Provider = new providers.Web3Provider(provider);

    await checkNetwork();
    const signer = web3Provider.getSigner();
    const account = await signer.getAddress();

    if (account !== undefined) {
      store.dispatch(setWalletAddr(account));
    }

    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      address: "",
      status: "Something went wrong: " + err.message,
    };
  }
};

export const getBalanceOfAccount = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const BoneContract = new web3.eth.Contract(BoneABI, BoneAddress);
    let totalBoneBalance = await BoneContract.methods.balanceOf(accounts[0]).call();
    totalBoneBalance = web3.utils.fromWei(totalBoneBalance.toString(), "ether");
    return {
      success: true,
      totalBoneBalance: Number(totalBoneBalance)
    }
  } catch (error) {
    console.log('[Get Balance] = ', error);
    return {
      success: false,
      result: "Something went wrong: "
    }
  }
}

export const getTokenAllowance = async () => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const BoneContract = new web3.eth.Contract(BoneABI, BoneAddress);
    let tokenAllowance = await BoneContract.methods.allowance(accounts[0], BridgeAddress).call();
    tokenAllowance = web3.utils.fromWei(tokenAllowance.toString(), "ether");
    return {
      success: true,
      tokenAllowance: Number(tokenAllowance).toFixed(2)
    }
  } catch (error) {
    console.log('[Get Allowance] = ', error);
    return {
      success: false,
      result: "Something went wrong: "
    }
  }
}

export const approveToken = async (approveAmount) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const BoneContract = new web3.eth.Contract(BoneABI, BoneAddress);
    // let decimal = 'ether', nDecimal = 18;
    // approveAmount = Math.floor(approveAmount * 10 ** nDecimal) / 10 ** nDecimal;
    approveAmount = web3.utils.toWei(approveAmount.toString(), "ether");
    const tx = await BoneContract.methods.approve(BridgeAddress, approveAmount).send({ from: accounts[0] });
    return {
      success: true,
      tx
    }
  } catch (error) {
    console.log('[Approve Error] = ', error);
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}

export const bridgeToken = async (coinAmount) => {
  const web3 = store.getState().auth.web3;
  if (!web3) return { success: false }
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) return { success: false }
    const BridgeContract = new web3.eth.Contract(BridgeABI, BridgeAddress);
    // let decimal = 'ether', nDecimal = 18;
    // coinAmount = Math.floor(coinAmount * 10 ** nDecimal) / 10 ** nDecimal;
    coinAmount = web3.utils.toWei(coinAmount.toString());
    const bridgeTokens = BridgeContract.methods.depositERC20ForUser(BoneAddress, accounts[0], coinAmount);

    await bridgeTokens.estimateGas({ from: accounts[0] });
    await BridgeContract.methods.depositERC20ForUser(BoneAddress, accounts[0], coinAmount).send({ from: accounts[0] });
    return {
      success: true
    }
  } catch (error) {
    console.log('[BUY Error] = ', error);
    return {
      success: false,
      error: parseErrorMsg(error.message)
    }
  }
}