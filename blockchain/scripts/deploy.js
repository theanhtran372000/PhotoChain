const main = async () => {
  // Deploy Licenses contract
  const Licenses = await hre.ethers.getContractFactory("Licenses");
  const licenses = await Licenses.deploy(1e15); // license fee is about 0.001 ETH

  await licenses.deployed(); 

  console.log(`Licenses contract deployed to: ${licenses.address}`);

  // Deploy Executor contract
  const Executor = await hre.ethers.getContractFactory("Executor");
  const executor = await Executor.deploy(licenses.address); // license fee is about 0.001 ETH

  await executor.deployed(); 

  console.log(`Executor contract deployed to: ${executor.address}`);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();