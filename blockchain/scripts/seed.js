const hre = require("hardhat");

async function main() {
  const [owner, contractor] = await hre.ethers.getSigners();
  
  const EscrowVault = await hre.ethers.getContractFactory("EscrowVault");
  const escrowVault = await EscrowVault.deploy();
  await escrowVault.waitForDeployment();
  const vaultAddress = await escrowVault.getAddress();
  console.log("EscrowVault deployed to:", vaultAddress);

  // Create initial projects
  const projects = [
    { id: "PJT001", budget: "5.0", contractor: contractor.address },
    { id: "PJT002", budget: "3.0", contractor: contractor.address },
  ];

  for (const p of projects) {
    const tx = await escrowVault.createProject(
      p.id, 
      p.contractor, 
      { value: hre.ethers.parseEther(p.budget) }
    );
    await tx.wait();
    console.log(`Created project ${p.id} with budget ${p.budget} ETH`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
