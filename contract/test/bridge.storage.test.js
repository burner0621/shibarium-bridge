const {
          accounts,
          contract,
      }             = require("@openzeppelin/test-environment");
const {
          BN,
          expectRevert,
      }             = require("@openzeppelin/test-helpers");
const {expect}      = require("chai");
const BridgeStorage = contract.fromArtifact("BridgeStorage");


describe("BridgeStorage", function () {
    const [caller, other] = accounts;
    const taskHash        = "0x02016836a56b71f0d02689e69e326f4f4c1b9057164ef592671cf0d37c8040c0";
    before(async function () {
        this.self = await BridgeStorage.new(caller);
    });

    it("name()", async function () {
        expect(await this.self.name()).to.be.equal("BridgeStorage");
    });

    it("setTaskInfo(caller)", async function () {
        await this.self.setTaskInfo(taskHash, 1, 1, {from: caller});
    });

    it("setTaskInfo(not caller)", async function () {
        await expectRevert(this.self.setTaskInfo(taskHash, 1, 1, {from: other}), "BridgeStorage:only use main contract to call");
    });

    it("addSupporter(caller)", async function () {
        await this.self.addSupporter(taskHash, other, {from: caller});
    });

    it("addSupporter(not caller)", async function () {
        await expectRevert(this.self.addSupporter(taskHash, other, {from: other}), "BridgeStorage:only use main contract to call");
    });

    it("supporterExists()", async function () {
        expect(await this.self.supporterExists(taskHash, other)).to.be.a.true;
    });

    it("getTaskInfo()", async function () {
        const result = await this.self.getTaskInfo(taskHash);
        expect(result[0]).to.be.bignumber.equal(new BN(1));
        expect(result[1]).to.be.bignumber.equal(new BN(1));
        expect(result[2]).to.be.bignumber.equal(new BN(1));
    });

    it("removeAllSupporter(caller)", async function () {
        await this.self.removeAllSupporter(taskHash, {from: caller});
        const result = await this.self.getTaskInfo(taskHash);
        expect(result[1]).to.be.bignumber.equal(new BN(1));
    });

    it("removeAllSupporter(not caller)", async function () {
        await expectRevert(this.self.removeAllSupporter(taskHash, {from: other}), "BridgeStorage:only use main contract to call");
    });

    it("removeTask(caller)", async function () {
        await this.self.removeTask(taskHash, {from: caller});
        const result = await this.self.getTaskInfo(taskHash);
        expect(result[0]).to.be.bignumber.equal(new BN(0));
        expect(result[1]).to.be.bignumber.equal(new BN(0));
        expect(result[2]).to.be.bignumber.equal(new BN(0));
    });

    it("removeTask(not caller)", async function () {
        await expectRevert(this.self.removeTask(taskHash, {from: other}), "BridgeStorage:only use main contract to call");
    });

});
