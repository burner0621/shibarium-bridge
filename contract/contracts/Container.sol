// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Container {
    struct Item {
        uint256 itemType;
        uint256 status;
        address[] addresses;
    }

    uint256 MaxItemAddressNum = 255;
    mapping(bytes32 => Item) private container;

    function itemAddressExists(bytes32 _id, address _oneAddress) internal view returns (bool) {
        for (uint256 i = 0; i < container[_id].addresses.length; i++) {
            if (container[_id].addresses[i] == _oneAddress)
                return true;
        }
        return false;
    }

    function getItemAddresses(bytes32 _id) internal view returns (address[] memory) {
        return container[_id].addresses;
    }

    function getItemInfo(bytes32 _id) internal view returns (uint256, uint256, uint256) {
        return (container[_id].itemType, container[_id].status, container[_id].addresses.length);
    }

    function getItemAddressCount(bytes32 _id) internal view returns (uint256) {
        return container[_id].addresses.length;
    }

    function setItemInfo(bytes32 _id, uint256 _itemType, uint256 _status) internal {
        container[_id].itemType = _itemType;
        container[_id].status = _status;
    }

    function addItemAddress(bytes32 _id, address _oneAddress) internal {
        require(!itemAddressExists(_id, _oneAddress), "Container:dup address added");
        require(container[_id].addresses.length < MaxItemAddressNum, "Container:too many addresses");
        container[_id].addresses.push(_oneAddress);
    }

    function removeItemAddresses(bytes32 _id) internal {
        delete container[_id].addresses;
    }

    function removeOneItemAddress(bytes32 _id, address _oneAddress) internal {
        for (uint256 i = 0; i < container[_id].addresses.length; i++) {
            if (container[_id].addresses[i] == _oneAddress) {
                container[_id].addresses[i] = container[_id].addresses[container[_id].addresses.length - 1];
                container[_id].addresses.pop();
                return;
            }
        }
    }

    function removeItem(bytes32 _id) internal {
        delete container[_id];
    }

    function replaceItemAddress(bytes32 _id, address _oneAddress, address _anotherAddress) internal {
        for (uint256 i = 0; i < container[_id].addresses.length; i++) {
            if (container[_id].addresses[i] == _oneAddress) {
                container[_id].addresses[i] = _anotherAddress;
                return;
            }
        }
    }

}
