var bridge_abi = require("./abi/bridge.json");
var bone_abi = require("./abi/bone.json");

let {CHAINS_SELECTION, ChainId, TOKENS_LIST} = require("../utils")

const mainChain = CHAINS_SELECTION.filter ((a) => a.chainId === ChainId.MAINNET)[0]
const shibaChain = CHAINS_SELECTION.filter ((a) => a.chainId === ChainId.SHIBARIUM)[0]
const mainToken = TOKENS_LIST[ChainId.MAINNET][0]

export const config = {
    chainId : mainChain.chainId, 
    mainNetUrl: mainChain.rpcUrl,
    INFURA_ID: '2f1093c7f57a4dcd84011ff6ef343dd8',
    bridgeAddress: mainToken.bridgePool,
    boneAddress: mainToken.address,
    bridgeAbi: bridge_abi,
    boneAbi: bone_abi,
}