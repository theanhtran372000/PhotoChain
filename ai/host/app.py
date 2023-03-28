from flask import Flask, request
import requests
from PIL import Image
from web3 import Web3
import argparse
import time
import os
import sys
import json
import pickle
from host.utils import get_transforms, ONNXModel, CosineDistance
from host.utils import intersection, substract, read_configs
from host.web3 import connect_node, get_contract, sign_and_send, view_or_pure
from flask_cors import CORS

# constant
last_nonce = 0


def image_from_id(image_id):
    return Image.open(requests.get("{}/ipfs/{}".format(configs['ipfs_subdomain'], image_id), stream=True).raw).convert('RGB')


def embed_from_ids(licensed_ids):

    all_ids = [file.split('.')[0] for file in os.listdir(configs['storage'])]
    owned_ids = intersection(licensed_ids, all_ids)

    results = {}
    for _id in owned_ids:
        path = os.path.join(configs['storage'], '{}.sav'.format(_id))
        emb = pickle.load(open(path, 'rb'))
        results[_id] = emb

    return results


def get_model(onnx_path):
    transforms = get_transforms()
    model = ONNXModel(onnx_path, transforms)
    return model


def get_parser():
    parser = argparse.ArgumentParser()

    parser.add_argument('--config', type=str,
                        default='host/configs.yaml', help='Path to config file')
    parser.add_argument('--port', type=int, default=2000, help='Listen port')
    parser.add_argument('--onnx_path', type=str,
                        default='ibot/model.onnx', help='Path to ONNX model')

    return parser


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/find_similar', methods=['POST'])
def find_similar():
    global last_nonce

    start = time.time()

    # Get request body data
    content = request.get_json()

    # Extract infos
    exec_code = content['code']
    image_id = content['id']                # current image
    image_hash = content['image_hash']      # read image from ipfs
    meta_hash = content['meta_hash']
    owner = content['address']

    # Get image
    image = image_from_id(image_hash)

    # Forward image through network
    new_embed = model(image)

    # Save result
    pickle.dump(new_embed, open(os.path.join(
        configs['storage'], '{}.sav'.format(image_id)), 'wb'))

    # Get existed embeds from metadata files
    licensed_ids = view_or_pure(license.functions.getAllLicensedPhotoIds)
    exist_embeds = embed_from_ids(licensed_ids)

    # Compare
    dists = []
    for embed in exist_embeds.values():
        dist = distance(new_embed, embed)
        dists.append(dist.item())

    if len(dists) > 0:
        min_dist = min(dists)
        min_idx = dists.index(min_dist)
    else:
        min_dist = 1000  # Very big number

    # Conclude
    print('Min dist: {:.6f}'.format(min_dist))

    result = 'OK'
    if min_dist <= configs['similar_threshold']:
        existed = list(exist_embeds.keys())[min_idx]
        print('Found existed image: {}'.format(existed))
        result = existed

    print('Result: ')
    print('- Code: {}\n- Id: {}\n- Result: {}\n'.format(exec_code, image_id, result))

    # Report result to Smart contract Executor
    print('Sending result to smart contract...')
    _, nonce = sign_and_send(
        web3,
        configs,
        last_nonce,
        executor.functions.addResult,
        exec_code, image_id, image_hash, meta_hash, Web3.toChecksumAddress(owner), result)  # function arguments
    last_nonce = nonce

    print('Done after {:.2f}s'.format(time.time() - start))

    return 'Done'


if __name__ == '__main__':
    print('=== Start running ===')

    ### Load config ###
    print('1. Loading config')
    parser = get_parser()
    args = parser.parse_args()
    configs = read_configs(args.config)
    print('Configs: ', configs)

    os.makedirs(configs['storage'], exist_ok=True)

    ### Preparation for Model ###
    print("2. Prepare model")
    model = get_model(args.onnx_path)
    distance = CosineDistance()

    ### Preparation for Smart contracts ###
    print('3. Connect to node provider')
    web3 = connect_node(configs['node_url'])
    if web3 is None:
        sys.exit("Failed to connect to node provider")

    # Executor contract
    with open(configs['executor_abi'], 'r') as f:
        abi = json.load(f)
        abi_str = json.dumps(abi['abi'])

    executor = get_contract(web3, configs['executor_address'], abi_str)
    # License contract
    with open(configs['license_abi'], 'r') as f:
        abi = json.load(f)
        abi_str = json.dumps(abi['abi'])

    license = get_contract(web3, configs['license_address'], abi_str)

    ### Preparation for local data ###
    # Get all licensed image exist in the blockchain
    print('4. Prepare local data storage')
    all_licensed_images = view_or_pure(
        license.functions.getAllLicensedPhotoIds)

    # Embed not-exist license
    local_licensed_images = [path.split('.')[0]
                             for path in os.listdir(configs['storage'])]
    need_to_embed_images = substract(
        all_licensed_images, local_licensed_images)

    if len(need_to_embed_images) > 0:
        print('Embedding image: ')

        for image_id in need_to_embed_images:
            # Load image from IPFS
            image = image_from_id(image_id)

            # Embed image
            new_embed = model(image)

            # Save result
            pickle.dump(new_embed, open(os.path.join(
                configs['storage'], '{}.sav'.format(image_id)), 'wb'))

            print('- Image id: ', image_id)
    else:
        print('All licensed image existed in local storage!')

    # Join the network
    print('5. Join the net')
    allUrls = view_or_pure(license.functions.getAllHostUrls)

    my_api = '{}:{}/{}'.format(configs['domain'],
                               args.port, configs['open_api'])
    if my_api not in allUrls:

        print('This host is not existed in smart contract')

        _, nonce = sign_and_send(
            web3,
            configs,
            last_nonce,
            license.functions.registerHost,
            my_api
        )
        last_nonce = nonce

        print('Registered this host at {}'.format(my_api))

    else:
        print('This host existed in smart contract')

    # Run app
    print('The app is running at port {}...'.format(args.port))
    app.run(host='0.0.0.0', port=args.port)
