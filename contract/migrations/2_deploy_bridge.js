const {expect}      = require("chai");
const {table}       = require("table");
const {
          BN,
          constants,
      }             = require("@openzeppelin/test-helpers");
const BridgeStorage = artifacts.require("BridgeStorage");
const BridgeLogic   = artifacts.require("BridgeLogic");
const Bridge        = artifacts.require("Bridge");
const BridgePair    = artifacts.require("BridgePair");
const result        = [["name", "address"]];

module.exports = async function (deployer, network, accounts) {
    const [runner, owner, operator1, operator2, operator3] = accounts;

    console.log(`Step1 depoying bridge module`);
    await deployer.deploy(Bridge, [runner, owner], 1, {from: runner});
    await deployer.deploy(BridgeLogic, Bridge.address, {from: runner});
    await deployer.deploy(BridgeStorage, BridgeLogic.address, {from: runner});
    await deployer.deploy(BridgePair, {from: runner});

    console.log(`Step2 initing bridge module`);
    const bridge = await Bridge.deployed();
    await bridge.pause({from: runner});
    await bridge.modifyAdminAddress("logic", constants.ZERO_ADDRESS, BridgeLogic.address, {from: runner});
    await bridge.modifyAdminAddress("store", constants.ZERO_ADDRESS, BridgeStorage.address, {from: runner});
    await bridge.addAddress("operator", operator1, {from: runner});
    await bridge.addAddress("operator", operator2, {from: runner});
    await bridge.addAddress("operator", operator3, {from: runner});
    await bridge.modifyAdminAddress("pauser", runner, owner, {from: runner});
    await bridge.dropAddress("owner", runner, {from: runner});
    await bridge.unpause({from: owner});

    const pair = await BridgePair.deployed();
    await pair.createCoin("eth", "kcs", "0x7f3E7408E4e42E5Aa49Aa741110246a788B6feAB", 6, true);
    await pair.createCoin("kcc", "kcs", constants.ZERO_ADDRESS, 18, false);
    await pair.createCoin("eth", "usdt", "0xC211F69500433D8536dB228812aCF47128F8f782", 6, true);
    await pair.createCoin("kcc", "usdt", "0x67f6a7BbE0da067A747C6b2bEdF8aBBF7D6f60dc", 18, true);
    await pair.createCoin("eth", "eth", constants.ZERO_ADDRESS, 18, false);
    await pair.createCoin("kcc", "weth", "0xF8Cb9f1D136Ff4c883320b5B4fa80048b888F459", 18, true);
    await pair.createPair(1, 2, 1);
    await pair.createPair(2, 1, 1);
    await pair.createPair(3, 4, 1);
    await pair.createPair(4, 3, 1);
    await pair.createPair(5, 6, 1);
    await pair.createPair(6, 5, 1);
    await pair.transferOwnership(owner);
    expect(await pair.owner()).to.be.equal(owner);

    const owners = await bridge.getAdminAddresses("owner");
    expect(owners).to.be.an("array").that.includes(owner);
    expect(owners.length).to.be.equal(1);
    expect(await bridge.getOwnerRequireNum()).to.be.bignumber.equal(new BN(1));

    const operators = await bridge.getAdminAddresses("operator");
    expect(operators).to.be.an("array").that.includes(operator1);
    expect(operators).to.be.an("array").that.includes(operator2);
    expect(operators).to.be.an("array").that.includes(operator3);
    expect(operators.length).to.be.equal(3);
    expect(await bridge.getOperatorRequireNum()).to.be.bignumber.equal(new BN(2));

    const pausers = await bridge.getAdminAddresses("pauser");
    expect(pausers).to.be.an("array").that.includes(owner);
    expect(pausers.length).to.be.equal(1);

    const logic = await bridge.getLogicAddress();
    expect(logic).to.be.equal(BridgeLogic.address);

    const store = await bridge.getStoreAddress();
    expect(store).to.be.equal(BridgeStorage.address);

    result.push(["Owners", owners]);
    result.push(["Pausers", pausers]);
    result.push(["Operators", operators]);
    result.push(["Bridge", Bridge.address]);
    result.push(["BridgeLogic", BridgeLogic.address]);
    result.push(["BridgeStorage", BridgeStorage.address]);
    result.push(["BridgePair", BridgePair.address]);

    console.log(table(result));
};
