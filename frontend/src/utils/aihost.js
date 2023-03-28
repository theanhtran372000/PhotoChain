// Send without await -> listen on smart contract event
export const sendRequest = (url, code, id, imagehash, metahash, address) => {
  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "code": code,
      "id": id,
      "image_hash": imagehash,
      'meta_hash': metahash,
      'address': address
    })
  })
}