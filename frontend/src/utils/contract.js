import license_abi from './Licenses.json'
import executor_abi from './Executor.json'

export const Licenses = {
  "ABI": license_abi.abi,
  "ADDRESS": "0x0ABDe1485A08De10C22D26f85a96cc64FBE4ba5b"
}

export const Executor = {
  "ABI": executor_abi.abi,
  "ADDRESS": "0x245A09244882913A8fB67967A44AD6B88Cc369D2"
}

export const MAX_FEE = 20e9;
export const MAX_PRIORITY_FEE = 2e9;  //WEI
export const ScannerAddress = 'https://goerli.etherscan.io/address'