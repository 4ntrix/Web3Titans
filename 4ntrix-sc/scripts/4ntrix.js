const { ethers, artifacts } = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  console.log("Deployment started!");

  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  console.log(`Deploying the contract with the account: ${address}`);

  const Antrix = await ethers.getContractFactory("Antrix");
  const contract = await Antrix.deploy(deployer);
  await contract.waitForDeployment()
  console.log(`Antrix deployed to ${contract.target}`);
  
  saveContractFiles(contract);
}

function saveContractFiles(contract) {
  const network = hre.network.name; // Get the network name from Hardhat runtime environment
  
  const contractDir = path.join(__dirname, "../../", "frontend", "contracts");
  if (!fs.existsSync(contractDir)) {
    fs.mkdirSync(contractDir);
  }

  fs.writeFileSync(
    path.join(contractDir, `contract-address-${network}.json`),
    JSON.stringify({ Antrix: contract.target }, null, 2)
  );

  const AntrixArtifact = artifacts.readArtifactSync("Antrix"); // Use correct contract name
  fs.writeFileSync(
    path.join(contractDir, `Antrix.json`),
    JSON.stringify(AntrixArtifact, null, 2)
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
