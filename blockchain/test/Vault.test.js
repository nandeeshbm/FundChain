const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EscrowVault", function () {
  let EscrowVault, escrowVault, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    EscrowVault = await ethers.getContractFactory("EscrowVault");
    escrowVault = await EscrowVault.deploy();
  });

  it("Should set the right owner", async function () {
    expect(await escrowVault.owner()).to.equal(owner.address);
  });

  it("Should create a project with milestones", async function () {
    const budget = ethers.parseEther("1.0");
    const milestones = [ethers.parseEther("0.3"), ethers.parseEther("0.3"), ethers.parseEther("0.4")];
    await escrowVault.createProject("P001", addr1.address, milestones, { value: budget });
    
    const project = await escrowVault.projects("P001");
    expect(project.totalBudget).to.equal(budget);
    expect(project.contractor).to.equal(addr1.address);
    expect(project.exists).to.be.true;
    expect(project.milestoneCount).to.equal(3);
  });

  it("Should release milestone funds", async function () {
    const budget = ethers.parseEther("1.0");
    const milestones = [ethers.parseEther("0.3"), ethers.parseEther("0.7")];
    await escrowVault.createProject("P001", addr1.address, milestones, { value: budget });
    
    const releaseAmount = ethers.parseEther("0.3");
    await expect(escrowVault.releaseFunds("P001", 0, "QmProofHash"))
      .to.changeEtherBalances([escrowVault, addr1], [-releaseAmount, releaseAmount]);
    
    const m = await escrowVault.getMilestone("P001", 0);
    expect(m.isReleased).to.be.true;
    expect(m.proofHash).to.equal("QmProofHash");
  });

  it("Should not release funds if frozen", async function () {
    const budget = ethers.parseEther("1.0");
    const milestones = [ethers.parseEther("1.0")];
    await escrowVault.createProject("P001", addr1.address, milestones, { value: budget });
    
    await escrowVault.freezeProject("P001", true);
    await expect(escrowVault.releaseFunds("P001", 0, "QmProofHash"))
      .to.be.revertedWith("Project is frozen");
  });
});
