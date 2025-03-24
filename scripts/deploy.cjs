const hre = require("hardhat");

async function main() {
  const CarbonCredits = await hre.ethers.getContractFactory("CarbonCredits");
  const carbonCredits = await CarbonCredits.deploy();
  await carbonCredits.waitForDeployment();
  const contractAddress = await carbonCredits.getAddress();
  console.log("CarbonCredits deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });