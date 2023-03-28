### Convert model to ONNX ###
import torch
import onnxruntime as ort
import numpy as np

# Convert model to ONNX format
def to_onnx(model, onnx_path, input_size=(1, 3, 224, 224)):
        
    dummy_input = torch.randn(*input_size)
    input_names = ['input']
    output_names = ['output']
    
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        input_names=input_names,
        output_names=output_names,
        export_params=True
    )
    
    # Check if model is ok
    print('Testing ONNX model...')
    onnx_session = ort.InferenceSession(onnx_path)
    threshold = 1e-3
    for i in range(5):
        dummy_input = torch.randn(*input_size)
        real_output = model(dummy_input).detach().numpy()
        
        onnx_inputs = {'input': dummy_input.numpy()}
        onnx_outputs = onnx_session.run(None, onnx_inputs)
        onnx_output = onnx_outputs[0]
        
        max_err = np.max(np.abs(onnx_output - real_output))
        print('[Test {}] Max error: {:.8f} Result: {}'.format(i + 1, max_err, 'Passed' if max_err < threshold else 'Failed'))
    
    print('Done!')

from models import VisionTransformer, vit_tiny, vit_small, vit_base, vit_large

# Load model from checkpoint
def load_model(model_path, arch='vit_base'):
    
    # Load state dict
    state_dict = torch.load(model_path)['state_dict']
    state_dict = {k.replace("module.", ""): v for k, v in state_dict.items()}
    
    # Create model
    backbone = vit_tiny if arch == 'vit_tiny' else vit_small if arch == 'vit_small' else vit_base if arch == 'vit_base' else vit_large
    vit = backbone(patch_size=16, return_all_tokens=True)
    
    # Load model and convert to eval mode
    vit.load_state_dict(state_dict, strict=False)
    vit.eval()
    
    # Freeze model
    for p in vit.parameters():
        p.requires_grad = False
    
    return vit

import argparse

# Define argument parser
def get_parser():
    parser = argparse.ArgumentParser()
    
    parser.add_argument('--model_path', type=str, default='model.pth', help='Path to pytorch model')
    parser.add_argument('--onnx_path', type=str, default='model.onnx', help='Output path to ONNX model')
    parser.add_argument('--infer_size', type=int, default=1, help='Inference batch size')
    
    return parser

# Main function
def main():
    # Get CLI args
    parser = get_parser()
    args = parser.parse_args()
    
    # Load model
    model = load_model(args.model_path)
    
    # Convert to onnx
    infer_batch_size = 1
    to_onnx(model, args.onnx_path, (infer_batch_size, 3, 224, 224))

if __name__ == '__main__':
    main()