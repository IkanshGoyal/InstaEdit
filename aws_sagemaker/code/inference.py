import torch
from PIL import Image
from torchvision import transforms
import io
import base64
import json
import os

# Load the traced model (will be used in SageMaker deployment)
def model_fn(model_dir):
    """
    Load the model from the model directory.
    """
    model_path = os.path.join(model_dir, "traced_model.pt")
    model = torch.jit.load(model_path, map_location=torch.device('cpu'))
    model.eval()  # Set the model to evaluation mode
    return model

# Preprocessing function for image input
def input_fn(request_body, content_type='application/json'):
    """
    Deserialize the input data. The input is assumed to be a base64-encoded image.
    """
    if content_type == 'application/json':
        request_data = json.loads(request_body)
        image_data = request_data['image']  # Base64 encoded image string
        img = Image.open(io.BytesIO(base64.b64decode(image_data)))
        return img
    raise ValueError("Content type not supported")

# Prediction function
def predict_fn(input_data, model):
    """
    Perform the inference step using the provided model.
    """
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
    ])
    input_tensor = transform(input_data).unsqueeze(0)  # Add batch dimension
    with torch.no_grad():
        predicted_mask = model(input_tensor)
        predicted_mask = torch.sigmoid(predicted_mask)
        predicted_mask = (predicted_mask > 0.5).float().squeeze().cpu().numpy()

    return predicted_mask

# Output function for serializing the prediction result
def output_fn(prediction, accept='application/json'):
    """
    Serialize the output data. The result is the predicted mask.
    """
    return json.dumps(prediction.tolist())



