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
Proxy contract address: 0x48d8021691c6e8a4D3346D6F12c9177f8b0B92Fa
Implementation contract address: 0xD8dFc1942a59ba572AD39289Ffc45d65d3fc6928
*/
