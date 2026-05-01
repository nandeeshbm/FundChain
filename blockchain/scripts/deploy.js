const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const VendorRegistry = await hre.ethers.getContractFactory("VendorRegistry");
  const vendorRegistry = await VendorRegistry.deploy();
  await vendorRegistry.waitForDeployment();
  console.log("VendorRegistry deployed to:", await vendorRegistry.getAddress());

  const EscrowVault = await hre.ethers.getContractFactory("EscrowVault");
  const escrowVault = await EscrowVault.deploy();
  await escrowVault.waitForDeployment();
  console.log("EscrowVault deployed to:", await escrowVault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
