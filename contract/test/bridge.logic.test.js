const {
          accounts,
          contract,
      }             = require("@openzeppelin/test-environment");
const {
          BN,
          constants,
          expectRevert,
      }             = require("@openzeppelin/test-helpers");
const {expect}      = require("chai");
const BridgeStorage = contract.fromArtifact("BridgeStorage");
const BridgeLogic   = contract.fromArtifact("BridgeLogic");


describe("BridgeLogic", function () {
    const [caller, other, killer] = accounts;
    const taskHash                = "0x02016836a56b71f0d02689e69e326f4f4c1b9057164ef592671cf0d37c8040c0";
    before(async function () {
        this.self    = await BridgeLogic.new(caller);
        this.storage = await BridgeStorage.new(this.self.address);
    });

    it("name()", async function () {
        expect(await this.self.name()).to.be.equal("BridgeLogic");
    });

    it("TASKINIT()", async function () {
        expect(await this.self.TASKINIT()).to.be.bignumber.equal(new BN(0));
    });

    it("TASKPROCESSING()", async function () {
        expect(await this.self.TASKPROCESSING()).to.be.bignumber.equal(new BN(1));
    });

    it("TASKCANCELLED()", async function () {
        expect(await this.self.TASKCANCELLED()).to.be.bignumber.equal(new BN(2));
    });

    it("TASKDONE()", async function () {
        expect(await this.self.TASKDONE()).to.be.bignumber.equal(new BN(3));
    });

    it("WITHDRAWTASK()", async function () {
        expect(await this.self.WITHDRAWTASK()).to.be.bignumber.equal(new BN(1));
    });

    it("resetStoreLogic(caller)", async function () {
        await this.self.resetStoreLogic(this.storage.address, {from: caller});
    });

    it("resetStoreLogic(not caller)", async function () {
        await expectRevert(this.self.resetStoreLogic(constants.ZERO_ADDRESS, {from: other}), "BridgeLogic:only use main contract to call");
    });

    it("getStoreAddress()", async function () {
        expect(await this.self.getStoreAddress()).to.be.equal(this.storage.address);
    });

    it("supportTask(caller)", async function () {
        await this.self.supportTask(1, taskHash, other, 2, {from: caller});
        const result = await this.storage.getTaskInfo(taskHash);
        expect(result[1]).to.be.bignumber.equal(new BN(1));
    });

    it("supportTask(not caller)", async function () {
        await expectRevert(this.self.supportTask(1, taskHash, other, 2, {from: other}), "BridgeLogic:only use main contract to call");
    });

    it("supportTask(support exists)", async function () {
        await expectRevert(this.self.supportTask(1, taskHash, other, 2, {from: caller}), "BridgeLogic:supporter already exists");
    });

    it("supportTask(wrong type)", async function () {
        await expectRevert(this.self.supportTask(2, taskHash, caller, 2, {from: caller}), "BridgeLogic:task type not match");
    });

    it("supportTask(double)", async function () {
        await this.self.supportTask(1, taskHash, caller, 2, {from: caller});
        const result = await this.storage.getTaskInfo(taskHash);
        expect(result[1]).to.be.bignumber.equal(new BN(3));
    });

    it("supportTask(wrong status)", async function () {
        await expectRevert(this.self.supportTask(1, taskHash, killer, 2, {from: caller}), "BridgeLogic:wrong status");
    });

    it("cancelTask(wrong status)", async function () {
        await expectRevert(this.self.cancelTask(taskHash, {from: caller}), "BridgeLogic:wrong status");
    });

    it("removeTask(caller)", async function () {
        await this.self.removeTask(taskHash, {from: caller});
    });

    it("removeTask(not caller)", async function () {
        await expectRevert(this.self.removeTask(taskHash, {from: other}), "BridgeLogic:only use main contract to call");
    });

    it("cancelTask(caller)", async function () {
        await this.self.supportTask(1, taskHash, caller, 2, {from: caller});
        await this.self.cancelTask(taskHash, {from: caller});
        const result = await this.storage.getTaskInfo(taskHash);
        expect(result[1]).to.be.bignumber.equal(new BN(2));
    });

    it("cancelTask(not caller)", async function () {
        await expectRevert(this.self.cancelTask(taskHash, {from: other}), "BridgeLogic:only use main contract to call");
    });

});
