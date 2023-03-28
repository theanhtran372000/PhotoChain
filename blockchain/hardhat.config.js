require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
const URL = "https://goerli.infura.io/v3/a25eb1e4e3a14e84af96ed88d1d4310e"
const PRIVATE_KEY = "2e50a1c32e92633752ef4d734abcf475062733e8bbb3b7f936959039417e2316"
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: URL,
      accounts: [PRIVATE_KEY]
    }
  }
};
