import { 
    createAction as action, 
    createAsyncAction as asyncAction 
} from 'typesafe-actions';

export const getNftBreakdown = asyncAction(
    'nft/GET_NFT_BREAKDOWN',
    'nft/GET_NFT_BREAKDOWN_SUCCESS',
    'nft/GET_NFT_BREAKDOWN_FAIL'
)();

export const setWeb3 = action('auth/SET_WEB3')();
export const setAuthState = action('auth/SET_AUTH_STATE')();
export const setWalletAddr = action('auth/SET_WALLET_ADDR')();
export const setChainID = action('auth/SET_CHAIN_ID')();
export const setBalance = action('auth/SET_BALANCE')();
export const setBridgeBalance = action('auth/SET_BRIDGE_BALANCE')();

export const showLoader = action('auth/SHOW_LOADER')();
export const hideLoader = action('auth/HIDE_LOADER')();