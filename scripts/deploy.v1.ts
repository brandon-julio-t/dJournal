import { ethers, upgrades } from 'hardhat';

async function main() {
  const impl = await ethers.getContractFactory('JournalContractImplV1');

  const proxy = await upgrades.deployProxy(impl);
  await proxy.waitForDeployment();

  const proxyAddress = await proxy.getAddress();
  const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

  console.log('Proxy contract address: ' + proxyAddress);
  console.log('Implementation contract address: ' + implAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

/*
Proxy contract address: 0xb41f71B95Accc5EaD2D950D4B2285c0B5D48b25d
Implementation contract address: 0xD8dFc1942a59ba572AD39289Ffc45d65d3fc6928
*/
