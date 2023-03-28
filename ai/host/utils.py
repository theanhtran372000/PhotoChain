import yaml
import torch
import torch.nn as nn
import onnxruntime as ort
from torchvision import transforms


def read_configs(config_path):
    with open(config_path, 'r') as f:
        configs = yaml.load(f, Loader=yaml.FullLoader)

    return configs


def intersection(lst1, lst2):
    lst3 = [value for value in lst1 if value in lst2]
    return lst3


def substract(lst1, lst2):
    lst3 = [value for value in lst1 if value not in lst2]
    return lst3


def get_transforms():
    return transforms.Compose([
        transforms.Resize(224),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
    ])


class CosineDistance:
    def __init__(self):
        self.distance = nn.CosineSimilarity(dim=0)

    def __call__(self, x1, x2):
        return 1 - self.distance(x1, x2)


class ONNXModel:
    def __init__(self, onnx_path, transforms=None):
        self.onnx_session = ort.InferenceSession(onnx_path)
        self.onnx_path = onnx_path
        self.transforms = transforms

    def __call__(self, image):
        """Forward function

        Args:
            image (PIL Image): Image in PIL format

        Returns:
            List: Image embedding
        """
        # Preprocess image
        if self.transforms:
            image = self.transforms(image).unsqueeze(0)

        # Forward image
        onnx_inputs = {'input': image.numpy()}
        onnx_outputs = self.onnx_session.run(None, onnx_inputs)
        onnx_output = onnx_outputs[0]
        return torch.tensor(onnx_output)[0][0]
