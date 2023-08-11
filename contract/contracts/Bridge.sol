// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "./BridgeAdmin.sol";
import "./BridgeLogic.sol";

contract Bridge is BridgeAdmin, Pausable {
    using SafeMath for uint256;

    string public constant name = "Bridge";

    BridgeLogic private logic;
    address public feeTo;
    address private assetWallet; // address of asset wallet

    uint public feePercent; // 1% -> 1
    uint public minFee; // 1$ -> 1
    uint public maxFee; // 50$ -> 50
    uint public minDepositAmount; // $50 -> 50

    uint public chainId; // 1: Ethereum

    struct assetSelector {
        string selector;
        bool isValueFirst;
    }

    struct tokenInfo {
        uint decimal;
        uint256 minFee;
        uint256 maxFee;
        uint256 minDepositAmount;
    }
    mapping(address => tokenInfo) public feeToken;

    mapping(address => assetSelector)  public depositSelector;
    mapping(address => assetSelector) public withdrawSelector;
    mapping(bytes32 => bool) public filledTx;
    mapping(bytes32 => uint256) public chainSwapFee;

    event FeeToTransferred(address indexed previousFeeTo, address indexed newFeeTo);
    event AssetWalletChanged(address indexed previousAssetWallet, address indexed newAssetWallet);
    event FeePercentChanged(uint previousFeePercent, uint newFeePercent);
    event MinDepositAmountChanged(uint previousMinDepositAmount, uint newMinDepositAmount);
    event MinFeeChanged(uint previousMinFee, uint newMinFee);
    event MaxFeeChanged(uint previousMaxFee, uint newMaxFee);
    event SwapFeeChanged(string chain, uint256 indexed previousSwapFee, uint256 indexed newSwapFee);
    event DepositNative(address indexed from, uint256 value, address targetAddress, uint sChain, uint dChain, uint256 feeValue);
    event DepositToken(address indexed from, uint256 value, address indexed token, address targetAddress, uint sChain, uint dChain, uint256 feeValue);
    event WithdrawingNative(address indexed to, uint256 value, string proof);
    event WithdrawingToken(address indexed to, address indexed token, uint256 value, string proof);
    event WithdrawDoneNative(address indexed to, uint256 value, string proof);
    event WithdrawDoneToken(address indexed to, address indexed token, uint256 value, string proof);

    modifier onlyOperator() {
        require(itemAddressExists(OPERATORHASH, msg.sender), "Bridge:wrong operator");
        _;
    }

    modifier onlyPauser() {
        require(itemAddressExists(PAUSERHASH, msg.sender), "Bridge:wrong pauser");
        _;
    }

    modifier positiveValue(uint _value) {
        require(_value > 0, "Bridge:value need > 0");
        _;
    }

    constructor(address[] memory _owners, uint _ownerRequired, uint _chainId) {
        initAdmin(_owners, _ownerRequired);
        feePercent = 1; // 1 %
        minFee = 1;
        maxFee = 50;
        minDepositAmount = 50;
        chainId = _chainId;
    }

    /**
        Deposit native currency
    */
    function depositNative(uint _dChainId) public payable {
        tokenInfo memory ti = feeToken[0x0000000000000000000000000000000000000000];

        /** Check if _amount is greater than minDepositAmount */
        require (msg.value >= ti.minDepositAmount, "The deposit amount of Native Currency is insufficient.");
        
        /* 
            Calculate the fee amount based on minFee and maxFee
        */
        uint256 feeAmount = msg.value * feePercent / 100;
        if (feeAmount < ti.minFee) {
            feeAmount = ti.minFee;
        } else if (feeAmount > ti.maxFee) {
            feeAmount = ti.maxFee;
        }

        payable(feeTo).transfer(feeAmount);
        payable(assetWallet).transfer(msg.value - feeAmount);
        emit DepositNative(msg.sender, msg.value - feeAmount, assetWallet, chainId, _dChainId, feeAmount);
    }

    function depositToken(address _token, uint value, uint _dChainId) public payable returns (bool) {
        tokenInfo memory ti = feeToken[_token];
        
        /** Check if _amount is greater than minDepositAmount */
        require (value >= ti.minDepositAmount, "The deposit amount of Token is insufficient.");

        /* 
            Calculate the fee amount based on minFee and maxFee
        */
        uint256 feeAmount = value * feePercent / 100;
        if (feeAmount < ti.minFee) {
            feeAmount = ti.minFee;
        } else if (feeAmount > ti.maxFee) {
            feeAmount = ti.maxFee;
        }
        
        bool res = depositTokenLogic(_token, msg.sender, value - feeAmount);
        emit DepositToken(msg.sender, value - feeAmount, _token, assetWallet, chainId, _dChainId, feeAmount);
        return res;
    }

    function withdrawNative(address payable to, uint value, string memory proof, bytes32 taskHash) public
    onlyOperator
    whenNotPaused
    positiveValue(value)
    returns (bool)
    {
        require(address(assetWallet).balance >= value, "Bridge:not enough native token");
        require(taskHash == keccak256((abi.encodePacked(to, value, proof))), "Bridge:taskHash is wrong");
        require(!filledTx[taskHash], "Bridge:tx filled already");
        uint256 status = logic.supportTask(logic.WITHDRAWTASK(), taskHash, msg.sender, operatorRequireNum);

        if (status == logic.TASKPROCESSING()) {
            emit WithdrawingNative(to, value, proof);
        } else if (status == logic.TASKDONE()) {
            emit WithdrawingNative(to, value, proof);
            emit WithdrawDoneNative(to, value, proof);
            to.transfer(value);
            filledTx[taskHash] = true;
            logic.removeTask(taskHash);
        }
        return true;
    }

    function withdrawToken(address _token, address to, uint value, string memory proof, bytes32 taskHash) public
    onlyOperator
    whenNotPaused
    positiveValue(value)
    returns (bool)
    {
        require(taskHash == keccak256((abi.encodePacked(to, value, proof))), "Bridge:taskHash is wrong");
        require(!filledTx[taskHash], "Bridge:tx filled already");
        uint256 status = logic.supportTask(logic.WITHDRAWTASK(), taskHash, msg.sender, operatorRequireNum);

        if (status == logic.TASKPROCESSING()) {
            emit WithdrawingToken(assetWallet, _token, value, proof);
        } else if (status == logic.TASKDONE()) {
            bool res = withdrawTokenLogic(_token, to, value);

            emit WithdrawingToken(to, _token, value, proof);
            emit WithdrawDoneToken(to, _token, value, proof);
            filledTx[taskHash] = true;
            logic.removeTask(taskHash);
            return res;
        }
        return true;
    }

    function modifyAdminAddress(string memory class, address oldAddress, address newAddress) public whenPaused {
        require(newAddress != address(0x0), "Bridge:wrong address");
        bool flag = modifyAddress(class, oldAddress, newAddress);
        if (flag) {
            bytes32 classHash = keccak256(abi.encodePacked(class));
            if (classHash == LOGICHASH) {
                logic = BridgeLogic(newAddress);
            } else if (classHash == STOREHASH) {
                logic.resetStoreLogic(newAddress);
            }
        }
    }

    function getLogicAddress() public view returns (address) {
        return address(logic);
    }

    function getStoreAddress() public view returns (address) {
        return logic.getStoreAddress();
    }

    function pause() public onlyPauser {
        _pause();
    }

    function unpause() public onlyPauser {
        _unpause();
    }

    function setDepositSelector(address token, string memory method, bool _isValueFirst) onlyOperator external {
        depositSelector[token] = assetSelector(method, _isValueFirst);
    }

    function setWithdrawSelector(address token, string memory method, bool _isValueFirst) onlyOperator external {
        withdrawSelector[token] = assetSelector(method, _isValueFirst);
    }

    function setSwapFee(string memory _chain, uint256 _swapFee) onlyOwner external {
        bytes32 chainHash = keccak256(abi.encodePacked(_chain));
        emit SwapFeeChanged(_chain, chainSwapFee[chainHash], _swapFee);
        chainSwapFee[chainHash] = _swapFee;
    }

    function getSwapFee(string memory _chain) public view returns (uint256) {
        bytes32 chainHash = keccak256(abi.encodePacked(_chain));
        return chainSwapFee[chainHash];
    }

    function setFeeTo(address _feeTo) onlyOwner external {
        emit FeeToTransferred(feeTo, _feeTo);
        feeTo = _feeTo;
    }

    /**
        _token: address of token - ex 0x0000000000000000000000000000000000000000
        _decimal: decimal of token - ex. 8
        _expectedPrice: expected price of token (8 decimal) - ex. 185000000000 (eth price)
    */
    function addToken(address _token, uint _decimal, uint256 _expectedPrice) external {
        uint256 _minFee = (minFee * (10 ** _decimal) / _expectedPrice) * 100000000;
        uint256 _maxFee = (maxFee * (10 ** _decimal) / _expectedPrice) * 100000000;
        uint256 _minDepositAmount = (minDepositAmount * (10 ** _decimal) / _expectedPrice) * 100000000;
        feeToken[_token] = tokenInfo(_decimal, _minFee, _maxFee, _minDepositAmount);
    }

    function setAssetWallet(address _assetWallet) onlyOwner external {
        emit AssetWalletChanged(assetWallet, _assetWallet);
        assetWallet = _assetWallet;
    }

    function getAssetWallet() public view returns (address) {
        return assetWallet;
    }

    function getFeePercent() public view returns (uint) {
        return feePercent;
    }

    function setFeePercent(uint _feePercent) onlyOwner external {
        emit FeePercentChanged(feePercent, _feePercent);
        feePercent = _feePercent;
    }

    function getMinFee() public view returns (uint) {
        return minFee;
    }

    function setMinFee(uint _minFee) onlyOwner external {
        emit MinFeeChanged(minFee, _minFee);
        minFee = _minFee;
    }

    function getMaxFee() public view returns (uint) {
        return maxFee;
    }

    function setMaxFee(uint _maxFee) onlyOwner external {
        emit MaxFeeChanged(maxFee, _maxFee);
        maxFee = _maxFee;
    }

    function getMinDepositAmount() public view returns (uint) {
        return minDepositAmount;
    }

    function setMinDepositAmount(uint _minDepositAmount) onlyOwner external {
        emit MinDepositAmountChanged(minDepositAmount, _minDepositAmount);
        minDepositAmount = _minDepositAmount;
    }

    function depositTokenLogic(address token, address _from, uint256 _value) internal returns (bool) {
        bool status = false;
        bytes memory returnedData;
        (status, returnedData) = token.call(abi.encodeWithSignature("transferFrom(address,address,uint256)", _from, assetWallet, _value));
        require(status && (returnedData.length == 0 || abi.decode(returnedData, (bool))), 'Bridge:deposit failed');
        return true;
    }

    function withdrawTokenLogic(address token, address _to, uint256 _value) internal returns (bool) {
        bool status = false;
        bytes memory returnedData;
        (status, returnedData) = token.call(abi.encodeWithSignature("transfer(address,uint256)", _to, _value));

        require(status && (returnedData.length == 0 || abi.decode(returnedData, (bool))), 'Bridge:withdraw failed');
        return true;
    }

}
