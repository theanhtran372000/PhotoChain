export const shortenAddress = (address) => `${address.slice(0, 5)}...${address.slice(address.length - 4)}`

export const fromHexToTime = (hex) => new Date(hex.toNumber() * 1000).toLocaleString()

export const fromHexToNumber = (hex) => hex.toNumber() * 1000

export function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}