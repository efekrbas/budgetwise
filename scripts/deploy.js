const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BudgetWise0G = await hre.ethers.getContractFactory("BudgetWise0G");
  const budgetWise = await BudgetWise0G.deploy();

  await budgetWise.waitForDeployment();

  console.log("BudgetWise0G deployed to:", await budgetWise.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
