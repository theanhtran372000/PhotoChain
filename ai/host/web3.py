from web3 import Web3

def connect_node(node_url):
    # Create the node connection
    web3 = Web3(Web3.HTTPProvider(node_url))

    # Verify if the connection is successful
    if web3.isConnected():
        print("Connected to {}".format(node_url))
        return web3
    else:
        print("Connect failed!")
        return None


def get_contract(web3, contract_address, abi):

    # Create smart contract instance
    contract = web3.eth.contract(address=contract_address, abi=abi)

    return contract


def sign_and_send(web3, configs, last_nonce, function, *args):
    # initialize the chain id, we need it to build the transaction for replay protection
    Chain_id = web3.eth.chain_id

    # Initialize address nonce
    nonce = web3.eth.getTransactionCount(configs['caller_address'])
    if nonce <= last_nonce:
        nonce = last_nonce + 1
    print('Nonce: ', nonce)

    # Call your function
    call_function = function(*args).buildTransaction(
        {
            "chainId": Chain_id, 
            "from": configs['caller_address'], 
            "nonce": nonce,
            "maxPriorityFeePerGas": Web3.toHex(int(configs["max_priority_gas"] * 1e9)),
            "maxFeePerGas": Web3.toHex(int(configs['max_gas'] * 1e9))
        }
    )

    # Sign transaction
    signed_tx = web3.eth.account.sign_transaction(
        call_function, private_key=configs['private_key'])

    # Send transaction
    send_tx = web3.eth.send_raw_transaction(signed_tx.rawTransaction)

    # Wait for transaction receipt
    tx_receipt = web3.eth.wait_for_transaction_receipt(send_tx)

    return tx_receipt, nonce


def view_or_pure(function, *args):
    return function(*args).call()
