const {
          accounts,
          contract,
      }               = require("@openzeppelin/test-environment");
const {
          BN,
          ether,
          constants,
          expectRevert,
          expectEvent,
      }               = require("@openzeppelin/test-helpers");
const {expect}        = require("chai");
const BridgeStorage   = contract.fromArtifact("BridgeStorage");
const BridgeLogic     = contract.fromArtifact("BridgeLogic");
const Bridge          = contract.fromArtifact("Bridge");
const BridgeMockERC20 = contract.fromArtifact("BridgeMockERC20");


describe("Bridge", function () {
    const [owner, operator1, operator2, operator3, user] = accounts;
    // proof='source_chain+source_chain_token_address+source_chain_tx_hash+source_chain_tx_log_index'
    const proof                                          = "kcc_a71edc38d189767582c38a3145b5873052c3e47a_5921591b4530abee2260edd8e72f9672164d89d1c705b400ec2a752faa0570db_1";
    const taskHash                                       = "0x063b06a2965d2df718fd086c3db5b6eb3d2a1edf7b79e4b34b23e45e7dabea9f";
    before(async function () {
        this.self    = await Bridge.new([owner], 1);
        this.logic   = await BridgeLogic.new(this.self.address);
        this.storage = await BridgeStorage.new(this.logic.address);
        this.erc20   = await BridgeMockERC20.new("BridgeMockERC20", "BME");
        await this.erc20._mint_for_testing(user, ether("1000"));
        await this.erc20.approve(this.self.address, constants.MAX_INT256, {from: user});
    });

    it("name()", async function () {
        expect(await this.self.name()).to.be.equal("Bridge");
    });

    it("getAdminAddresses(invalid class)", async function () {
        await expectRevert(this.self.getAdminAddresses("invalid"), "BridgeAdmin:invalid class");
    });

    it("getAdminAddresses(owner)", async function () {
        expect(await this.self.getAdminAddresses("owner")).to.be.an("array").that.includes(owner);
        expect((await this.self.getAdminAddresses("owner")).length).to.be.equal(1);
    });

    it("getOwnerRequireNum()", async function () {
        expect(await this.self.getOwnerRequireNum()).to.be.bignumber.equal(new BN(1));
    });

    it("getOperatorRequireNum()", async function () {
        expect(await this.self.getOperatorRequireNum()).to.be.bignumber.equal(new BN(2));
    });

    it("addAddress(invalid class)", async function () {
        await expectRevert(this.self.addAddress("invalid", operator1, {from: owner}), "BridgeAdmin:invalid class");
    });

    it("addAddress(wrong class)", async function () {
        await expectRevert(this.self.addAddress("store", operator1, {from: owner}), "BridgeAdmin:wrong class");
        await expectRevert(this.self.addAddress("logic", operator1, {from: owner}), "BridgeAdmin:wrong class");
    });

    it("addAddress(not owner)", async function () {
        await expectRevert(this.self.addAddress("invalid", operator1, {from: operator2}), "BridgeAdmin:only use owner to call");
    });

    it("addAddress(operator)", async function () {
        expectEvent(await this.self.addAddress("operator", operator1, {from: owner}), "AdminChanged", {
            TaskType:   "addAddress",
            class:      "operator",
            oldAddress: operator1,
            newAddress: operator1,
        });
        expectEvent(await this.self.addAddress("operator", operator2, {from: owner}), "AdminChanged", {
            TaskType:   "addAddress",
            class:      "operator",
            oldAddress: operator2,
            newAddress: operator2,
        });

        expectEvent(await this.self.addAddress("operator", operator3, {from: owner}), "AdminChanged", {
            TaskType:   "addAddress",
            class:      "operator",
            oldAddress: operator3,
            newAddress: operator3,
        });
        expect(await this.self.getAdminAddresses("operator")).to.be.an("array").that.includes(operator1);
        expect(await this.self.getAdminAddresses("operator")).to.be.an("array").that.includes(operator2);
        expect(await this.self.getAdminAddresses("operator")).to.be.an("array").that.includes(operator3);
        expect((await this.self.getAdminAddresses("operator")).length).to.be.equal(3);
    });

    it("dropAddress(invalid class)", async function () {
        await expectRevert(this.self.dropAddress("invalid", operator1, {from: owner}), "BridgeAdmin:invalid class");
    });

    it("dropAddress(wrong class)", async function () {
        await expectRevert(this.self.dropAddress("store", operator1, {from: owner}), "BridgeAdmin:wrong class");
        await expectRevert(this.self.dropAddress("logic", operator1, {from: owner}), "BridgeAdmin:wrong class");
    });

    it("dropAddress(not exists)", async function () {
        await expectRevert(this.self.dropAddress("owner", operator1, {from: owner}), "BridgeAdmin:no such address exists");
    });

    it("dropAddress(insuffience)", async function () {
        await expectRevert(this.self.dropAddress("owner", owner, {from: owner}), "BridgeAdmin:insufficiency addresses");
    });

    it("dropAddress(not owner)", async function () {
        await expectRevert(this.self.dropAddress("invalid", operator1, {from: operator2}), "BridgeAdmin:only use owner to call");
    });

    it("dropAddress(operator)", async function () {
        expectEvent(await this.self.dropAddress("operator", operator1, {from: owner}), "AdminChanged", {
            TaskType:   "dropAddress",
            class:      "operator",
            oldAddress: operator1,
            newAddress: operator1,
        });
        expect(await this.self.getAdminAddresses("operator")).to.be.an("array").that.not.includes(operator1);
        expect(await this.self.getAdminAddresses("operator")).to.be.an("array").that.includes(operator2);
        expect(await this.self.getAdminAddresses("operator")).to.be.an("array").that.includes(operator3);
        expect((await this.self.getAdminAddresses("operator")).length).to.be.equal(2);
    });

    it("resetRequiredNum(invalid class)", async function () {
        await expectRevert(this.self.resetRequiredNum("invalid", 2, {from: owner}), "BridgeAdmin:invalid class");
    });

    it("resetRequiredNum(wrong class)", async function () {
        await expectRevert(this.self.resetRequiredNum("store", 2, {from: owner}), "BridgeAdmin:wrong class");
        await expectRevert(this.self.resetRequiredNum("logic", 2, {from: owner}), "BridgeAdmin:wrong class");
    });

    it("resetRequiredNum(insuffience)", async function () {
        await expectRevert(this.self.resetRequiredNum("owner", 2, {from: owner}), "BridgeAdmin:insufficiency addresses");
    });

    it("resetRequiredNum(operator)", async function () {
        expectEvent(await this.self.resetRequiredNum("operator", 1, {from: owner}), "AdminRequiredNumChanged", {
            TaskType:    "resetRequiredNum",
            class:       "operator",
            previousNum: new BN(2),
            requiredNum: new BN(1),
        });
        expectEvent(await this.self.resetRequiredNum("owner", 1, {from: owner}), "AdminRequiredNumChanged", {
            TaskType:    "resetRequiredNum",
            class:       "owner",
            previousNum: new BN(1),
            requiredNum: new BN(1),
        });
    });

    it("modifyAdminAddress(not paused)", async function () {
        await expectRevert(this.self.modifyAdminAddress("logic", constants.ZERO_ADDRESS, this.logic.address, {from: owner}), "Pausable: not paused");
    });

    it("pause(not pauser)", async function () {
        await expectRevert(this.self.pause({from: operator1}), "Bridge:wrong pauser");
    });

    it("pause(pauser)", async function () {
        expectEvent(await this.self.pause({from: owner}), "Paused", {
            account: owner,
        });
    });

    it("modifyAdminAddress(not owner)", async function () {
        await expectRevert(this.self.modifyAdminAddress("logic", constants.ZERO_ADDRESS, this.logic.address, {from: operator1}), "BridgeAdmin:only use owner to call");
    });

    it("modifyAdminAddress(not zero)", async function () {
        await expectRevert(this.self.modifyAdminAddress("logic", constants.ZERO_ADDRESS, constants.ZERO_ADDRESS, {from: owner}), "Bridge:wrong address");
    });

    it("modifyAdminAddress(logic)", async function () {
        expectEvent(await this.self.modifyAdminAddress("logic", constants.ZERO_ADDRESS, this.logic.address, {from: owner}), "AdminChanged", {
            TaskType:   "modifyAddress",
            class:      "logic",
            oldAddress: constants.ZERO_ADDRESS,
            newAddress: this.logic.address,
        });
    });

    it("getLogicAddress()", async function () {
        expect(await this.self.getLogicAddress()).to.be.equal(this.logic.address);
    });

    it("modifyAdminAddress(store)", async function () {
        expectEvent(await this.self.modifyAdminAddress("store", constants.ZERO_ADDRESS, this.storage.address, {from: owner}), "AdminChanged", {
            TaskType:   "modifyAddress",
            class:      "store",
            oldAddress: constants.ZERO_ADDRESS,
            newAddress: this.storage.address,
        });
    });

    it("getStoreAddress()", async function () {
        expect(await this.self.getStoreAddress()).to.be.equal(this.storage.address);
    });

    it("unpause(not pauser)", async function () {
        await expectRevert(this.self.unpause({from: operator1}), "Bridge:wrong pauser");
    });

    it("unpause(pauser)", async function () {
        expectEvent(await this.self.unpause({from: owner}), "Unpaused", {
            account: owner,
        });
    });

    it("depositNative(without fee)", async function () {
        expectEvent(await this.self.depositNative(user, "kcc", {
            from:  user,
            value: ether("0"),
        }), "DepositNative", {
            from:          user,
            value:         ether("0"),
            targetAddress: user,
            chain:         "kcc",
        });

        expectEvent(await this.self.depositNative(user, "kcc", {
            from:  user,
            value: ether("1"),
        }), "DepositNative", {
            from:          user,
            value:         ether("1"),
            targetAddress: user,
            chain:         "kcc",
        });
    });

    it("depositToken(without fee)", async function () {
        expect(await this.erc20.balanceOf(user)).to.be.bignumber.equal(ether("1000"));
        expect(await this.erc20.allowance(user, this.self.address)).to.be.bignumber.equal(constants.MAX_INT256);
        expectEvent(await this.self.depositToken(this.erc20.address, ether("1"), user, "kcc", {
            from:  user,
            value: ether("0"),
        }), "DepositToken", {
            from:          user,
            value:         ether("1"),
            token:         this.erc20.address,
            targetAddress: user,
            chain:         "kcc",
            feeValue:      ether("0"),
        });
        expect(await this.erc20.balanceOf(user)).to.be.bignumber.equal(ether("999"));
        expect(await this.erc20.balanceOf(this.self.address)).to.be.bignumber.equal(ether("1"));
    });

    it("setFeeTo(not owner)", async function () {
        await expectRevert(this.self.setFeeTo(owner, {from: operator1}), "BridgeAdmin:only use owner to call");
    });

    it("setFeeTo(owner)", async function () {
        expectEvent(await this.self.setFeeTo(owner, {from: owner}), "FeeToTransferred", {
            previousFeeTo: constants.ZERO_ADDRESS,
            newFeeTo:      owner,
        });
        expect(await this.self.feeTo()).to.be.equal(owner);
    });

    it("setSwapFee(not owner)", async function () {
        await expectRevert(this.self.setSwapFee("kcc", 1, {from: operator1}), "BridgeAdmin:only use owner to call");
    });

    it("setSwapFee(owner)", async function () {
        expectEvent(await this.self.setSwapFee("kcc", ether("0.1"), {from: owner}), "SwapFeeChanged", {
            chain:           "kcc",
            previousSwapFee: new BN(0),
            newSwapFee:      ether("0.1"),
        });
        expect(await this.self.getSwapFee("kcc")).to.be.bignumber.equal(ether("0.1"));
    });

    it("setDepositSelector(not operator)", async function () {
        await expectRevert(this.self.setDepositSelector(constants.ZERO_ADDRESS, "transferFrom(address,address,uint256)", false, {from: owner}), "Bridge:wrong operator");
    });

    it("setDepositSelector(operator)", async function () {
        await this.self.setDepositSelector(constants.ZERO_ADDRESS, "transferFrom(address,address,uint256)", false, {from: operator2});
        const result = await this.self.depositSelector(constants.ZERO_ADDRESS);
        expect(result.selector).to.be.equal("transferFrom(address,address,uint256)");
        expect(result.isValueFirst).to.be.a.false;
    });

    it("setWithdrawSelector(not operator)", async function () {
        await expectRevert(this.self.setWithdrawSelector(constants.ZERO_ADDRESS, "transferFrom(address,address,uint256)", false, {from: owner}), "Bridge:wrong operator");
    });

    it("setWithdrawSelector(operator)", async function () {
        await this.self.setWithdrawSelector(constants.ZERO_ADDRESS, "transfer(address,uint256)", false, {from: operator2});
        const result = await this.self.withdrawSelector(constants.ZERO_ADDRESS);
        expect(result.selector).to.be.equal("transfer(address,uint256)");
        expect(result.isValueFirst).to.be.a.false;
    });

    it("depositNative(with fee)", async function () {
        await expectRevert(this.self.depositNative(user, "kcc", {
            from:  user,
            value: ether("0"),
        }), "Bridge:insufficient swap fee");
        expectEvent(await this.self.depositNative(user, "kcc", {
            from:  user,
            value: ether("1"),
        }), "DepositNative", {
            from:          user,
            value:         ether("0.9"),
            targetAddress: user,
            chain:         "kcc",
            feeValue:      ether("0.1"),
        });
    });

    it("depositToken(with fee)", async function () {
        expect(await this.erc20.balanceOf(user)).to.be.bignumber.equal(ether("999"));
        expectEvent(await this.self.depositToken(this.erc20.address, ether("1"), user, "kcc", {
            from:  user,
            value: ether("0.1"),
        }), "DepositToken", {
            from:          user,
            value:         ether("1"),
            token:         this.erc20.address,
            targetAddress: user,
            chain:         "kcc",
            feeValue:      ether("0.1"),
        });
        expect(await this.erc20.balanceOf(user)).to.be.bignumber.equal(ether("998"));
        expect(await this.erc20.balanceOf(this.self.address)).to.be.bignumber.equal(ether("2"));
    });

    it("withdrawNative(not operator)", async function () {
        await expectRevert(this.self.withdrawNative(constants.ZERO_ADDRESS, 1, proof, taskHash, {from: owner}), "Bridge:wrong operator");
    });

    it("withdrawNative(not enough)", async function () {
        await expectRevert(this.self.withdrawNative(constants.ZERO_ADDRESS, ether("100"), proof, taskHash, {from: operator2}), "Bridge:not enough native token");
    });

    it("withdrawNative(wrong task hash)", async function () {
        await expectRevert(this.self.withdrawNative(constants.ZERO_ADDRESS, 1, proof, "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a471", {from: operator2}), "Bridge:taskHash is wrong");
    });

    it("withdrawNative(once)", async function () {
        expectEvent(await this.self.withdrawNative(constants.ZERO_ADDRESS, 1, proof, taskHash, {
            from: operator2,
        }), "WithdrawingNative", {
            to:    constants.ZERO_ADDRESS,
            value: new BN("1"),
            proof: proof,
        });
    });

    it("withdrawNative(twice)", async function () {
        await expectRevert(this.self.withdrawNative(constants.ZERO_ADDRESS, 1, proof, taskHash, {
            from: operator2,
        }), "Bridge:tx filled already");
    });

    it("withdrawToken(not operator)", async function () {
        await expectRevert(this.self.withdrawToken(this.erc20.address, constants.ZERO_ADDRESS, 1, proof, taskHash, {from: owner}), "Bridge:wrong operator");
    });

    it("withdrawToken(wrong task hash)", async function () {
        await expectRevert(this.self.withdrawToken(this.erc20.address, constants.ZERO_ADDRESS, 1, proof, "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a471", {from: operator2}), "Bridge:taskHash is wrong");
    });

    it("withdrawToken(once)", async function () {
        expectEvent(await this.self.withdrawToken(this.erc20.address, "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 1, proof, "0x05c6e62a3bda695db7eb272bc945462d180613e7fb6f0c42f989698c3a014e79", {
            from: operator2,
        }), "WithdrawingToken", {
            to:    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
            value: new BN("1"),
            proof: proof,
        });
    });

    it("withdrawToken(filled)", async function () {
        await expectRevert(this.self.withdrawToken(this.erc20.address, "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 1, proof, "0x05c6e62a3bda695db7eb272bc945462d180613e7fb6f0c42f989698c3a014e79", {
            from: operator2,
        }), "Bridge:tx filled already");
    });

    it.skip("transferToken(not pauser)", async function () {
        await expectRevert(this.self.transferToken(this.erc20.address, "0x0000000000000000000000000000000000000001", 1, {
            from: user,
        }), "Bridge:wrong pauser");
    });

    it.skip("transferToken(success)", async function () {
        expect(await this.erc20.balanceOf("0x0000000000000000000000000000000000000001")).to.be.bignumber.equal(new BN(0));
        await this.self.transferToken(this.erc20.address, "0x0000000000000000000000000000000000000001", 1, {
            from: owner,
        });
        expect(await this.erc20.balanceOf("0x0000000000000000000000000000000000000001")).to.be.bignumber.equal(new BN(1));
    });

    it.skip("transferNative(not pauser)", async function () {
        await expectRevert(this.self.transferNative("0x0000000000000000000000000000000000000001", 1, {
            from: user,
        }), "Bridge:wrong pauser");
    });

    it.skip("transferNative(insuffience)", async function () {
        await expectRevert(this.self.transferNative("0x0000000000000000000000000000000000000001", ether("100"), {
            from: owner,
        }), "Bridge:transfer amount exceeds balance");
    });

    it.skip("transferNative(not payable)", async function () {
        await expectRevert(this.self.transferNative(this.erc20.address, 1, {
            from: owner,
        }), "Bridge:failed to send native");
    });

    it.skip("transferNative(success)", async function () {
        await this.self.transferNative("0x0000000000000000000000000000000000000001", 1, {
            from: owner,
        });
    });

});
