const {
          accounts,
          contract,
      }          = require("@openzeppelin/test-environment");
const {
          BN,
          constants,
          expectRevert,
          expectEvent,
      }          = require("@openzeppelin/test-helpers");
const {expect}   = require("chai");
const BridgePair = contract.fromArtifact("BridgePair");


describe("BridgePair", function () {
    const [owner, other] = accounts;
    before(async function () {
        this.self = await BridgePair.new({from: owner});
    });

    it("name()", async function () {
        expect(await this.self.name()).to.be.equal("BridgePair");
    });

    it("createCoin(not owner)", async function () {
        await expectRevert(this.self.createCoin("eth", "eth", constants.ZERO_ADDRESS, 18, false, {from: other}), "Ownable: caller is not the owner");
    });

    it("createCoin(eth)", async function () {
        expectEvent(await this.self.createCoin("eth", "eth", constants.ZERO_ADDRESS, 18, false, {
            from: owner,
        }), "CreatedCoin", {
            id:       new BN(1),
            chain:    "eth",
            currency: "eth",
            token:    constants.ZERO_ADDRESS,
            decimals: new BN(18),
            tag:      false,
        });
    });

    it("createCoin(kcc)", async function () {
        expectEvent(await this.self.createCoin("kcc", "eth", constants.ZERO_ADDRESS, 18, false, {
            from: owner,
        }), "CreatedCoin", {
            id:       new BN(2),
            chain:    "kcc",
            currency: "eth",
            token:    constants.ZERO_ADDRESS,
            decimals: new BN(18),
            tag:      false,
        });
    });


    it("createCoin(exists)", async function () {
        await expectRevert(this.self.createCoin("eth", "eth", constants.ZERO_ADDRESS, 18, false, {
            from: owner,
        }), "BridgePair:coin already exists");
    });

    it("createPair(not owner)", async function () {
        await expectRevert(this.self.createPair(1, 2, 1, {from: other}), "Ownable: caller is not the owner");
    });

    it("createPair(src cid not exists)", async function () {
        await expectRevert(this.self.createPair(100, 2, 1, {from: owner}), "BridgePair:src cid not exists");
    });

    it("createPair(dst cid not exists)", async function () {
        await expectRevert(this.self.createPair(1, 200, 1, {from: owner}), "BridgePair:dst cid not exists");
    });

    it("createPair(eth/eth-kcc/eth)", async function () {
        expectEvent(await this.self.createPair(1, 2, 1, {
            from: owner,
        }), "CreatedPair", {
            id:     new BN(1),
            srcCid: new BN(1),
            dstCid: new BN(2),
            status: new BN(1),
        });
    });

    it("createPair(pair already exists)", async function () {
        await expectRevert(this.self.createPair(1, 2, 1, {from: owner}), "BridgePair:pair already exists");
    });

    it("updatePair(not owner)", async function () {
        await expectRevert(this.self.updatePair(1, 0, {from: other}), "Ownable: caller is not the owner");
    });

    it("updatePair()", async function () {
        expectEvent(await this.self.updatePair(1, 0, {
            from: owner,
        }), "UpdatedPair", {
            id:     new BN(1),
            srcCid: new BN(1),
            dstCid: new BN(2),
            status: new BN(0),
        });
    });

});
