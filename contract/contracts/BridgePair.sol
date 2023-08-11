// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgePair is Ownable {
    string public constant name = "BridgePair";

    struct Coin {
        string chain;
        string currency;
        address token;
        uint8 decimals;
        bool tag;
    }

    struct Pair {
        uint256 srcCid;
        uint256 dstCid;
        uint256 status;
    }

    uint256 public numCoins;
    uint256 public numPairs;

    mapping(bytes32 => bool) public _coins;
    mapping(bytes32 => bool) public _pairs;
    mapping(uint256 => Coin) public coins;
    mapping(uint256 => Pair) public pairs;

    event CreatedCoin(uint256 id, string chain, string currency, address token, uint8 decimals, bool tag);
    event CreatedPair(uint256 id, uint256 srcCid, uint256 dstCid, uint256 status);
    event UpdatedPair(uint256 id, uint256 srcCid, uint256 dstCid, uint256 status);

    constructor() {}

    function createCoin(string calldata chain, string calldata currency, address token, uint8 decimals, bool tag) external onlyOwner returns (uint256 coinId) {
        bytes32 key = keccak256((abi.encodePacked(chain, currency, token)));
        require(!_coins[key], "BridgePair:coin already exists");

        coinId = ++numCoins;
        coins[coinId] = Coin(chain, currency, token, decimals, tag);
        _coins[key] = true;

        emit CreatedCoin(coinId, chain, currency, token, decimals, tag);
    }

    function createPair(uint256 srcCid, uint256 dstCid, uint256 status) external onlyOwner returns (uint256 pairId) {
        bytes32 key = keccak256((abi.encodePacked(srcCid, dstCid)));
        require(!_pairs[key], "BridgePair:pair already exists");
        require(bytes(coins[srcCid].chain).length != 0, "BridgePair:src cid not exists");
        require(bytes(coins[dstCid].chain).length != 0, "BridgePair:dst cid not exists");

        pairId = ++numPairs;
        pairs[pairId] = Pair(srcCid, dstCid, status);
        _pairs[key] = true;

        emit CreatedPair(pairId, srcCid, dstCid, status);
    }

    function updatePair(uint256 pairId, uint256 status) external onlyOwner {
        require(pairs[pairId].srcCid != 0, "BridgePair:pair not exists");

        Pair storage pair = pairs[pairId];
        pair.status = status;

        emit UpdatedPair(pairId, pair.srcCid, pair.dstCid, status);
    }

}
