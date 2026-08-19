import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "0G");

  const BudgetWise0G = await hre.ethers.getContractFactory("BudgetWise0G");
  const budgetWise = await BudgetWise0G.deploy();

  await budgetWise.waitForDeployment();

  const address = await budgetWise.getAddress();
  console.log("BudgetWise0G deployed to:", address);
  console.log("View on 0G Explorer: https://chainscan-galileo.0g.ai/address/" + address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
