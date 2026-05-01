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

  it("Should create a project", async function () {
    const budget = ethers.parseEther("1.0");
    await escrowVault.createProject("P001", addr1.address, { value: budget });
    
    const project = await escrowVault.projects("P001");
    expect(project.totalBudget).to.equal(budget);
    expect(project.contractor).to.equal(addr1.address);
    expect(project.exists).to.be.true;
  });

  it("Should release funds", async function () {
    const budget = ethers.parseEther("1.0");
    await escrowVault.createProject("P001", addr1.address, { value: budget });
    
    const releaseAmount = ethers.parseEther("0.5");
    await expect(escrowVault.releaseFunds("P001", releaseAmount))
      .to.changeEtherBalances([escrowVault, addr1], [-releaseAmount, releaseAmount]);
  });
});
