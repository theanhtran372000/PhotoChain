// Deal with IPFS here

import { create, urlSource } from "ipfs-http-client"

// IPFS Client info
export const IPFS = {
  "PROJECT_ID": "2KXwwzgBdGWxBIZrmSvQ7l07x89",
  "SECRET_KEY": "79906ce8d13a224f5d85b43386bc6c32",
  "API_URL": "https://ipfs.infura.io:5001/api/v0",
  "SUBDOMAIN": "https://photo-chain.infura-ipfs.io"
}

// Authorize infomation
export const authorization = "Basic " + window.btoa(IPFS.PROJECT_ID + ":" + IPFS.SECRET_KEY);

// Connect to IPFS
export const connect = () => {
  return create({
    url: IPFS.API_URL,
    headers: {
      authorization
    }
  })
}

// Add function //
// Return type:
// - cid: hash value
// - path: input path
// - size: size in byte

// add file from input (type file)
export const addInputFile = async (file) => {
  const ipfs = connect()
  return await ipfs.add(file);
}

// add file from url
export const addUrlFile = async (url) => {
  const ipfs = connect()
  return await ipfs.add(urlSource(url))
}

// add json file from object
export const addJsonFile = async (data) => {
  const ipfs = connect()
  const dataStr = JSON.stringify(data)
  return await ipfs.add(dataStr)
}

// Get function
export const getImageUrl = (cid) => {
  return `${IPFS.SUBDOMAIN}/ipfs/${cid}`
}

// Delete (unpin in IPFS)
export const deleteFile = async (path) => {
  const headers = new Headers()
  headers.append('Authorization', authorization)

  const result = await fetch (`${IPFS.API_URL}/pin/rm?${new URLSearchParams({
    arg: path
  })}`, {
    method: 'POST',
    headers: headers
  })

  const data = await result.json()
  console.log(data)
}

