// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./Container.sol";

contract BridgeStorage is Container {
    string public constant name = "BridgeStorage";

    address private caller;

    constructor(address aCaller) {
        caller = aCaller;
    }

    modifier onlyCaller() {
        require(msg.sender == caller, "BridgeStorage:only use main contract to call");
        _;
    }

    function supporterExists(bytes32 taskHash, address user) public view returns (bool) {
        return itemAddressExists(taskHash, user);
    }

    function setTaskInfo(bytes32 taskHash, uint256 taskType, uint256 status) external onlyCaller {
        setItemInfo(taskHash, taskType, status);
    }

    function getTaskInfo(bytes32 taskHash) public view returns (uint256, uint256, uint256) {
        return getItemInfo(taskHash);
    }

    function addSupporter(bytes32 taskHash, address oneAddress) external onlyCaller {
        addItemAddress(taskHash, oneAddress);
    }

    function removeAllSupporter(bytes32 taskHash) external onlyCaller {
        removeItemAddresses(taskHash);
    }

    function removeTask(bytes32 taskHash) external onlyCaller {
        removeItem(taskHash);
    }

}
