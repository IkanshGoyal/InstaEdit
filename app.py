from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import torch
from PIL import Image
from torchvision import transforms
import io
import base64
import os
import gdown

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Specify the Google Drive file ID and the download destination
MODEL_URL = "https://drive.google.com/uc?id=16JDNkA6kEb1Ht_S1dIIk532oNHrKM11-"
MODEL_DIR = "object_mask_models"
MODEL_PATH = os.path.join(MODEL_DIR, "traced_model.pt")

# Ensure the model directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

# Download the model file if it doesn't exist
if not os.path.exists(MODEL_PATH):
    print("Downloading model...")
    gdown.download(MODEL_URL, MODEL_PATH, quiet=False)

# Load the model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = torch.jit.load(MODEL_PATH, map_location=torch.device("cpu"))
model.to(device)
model.eval()

def preprocess_image(image, img_size=(256, 256)):
    transform = transforms.Compose([
        transforms.Resize(img_size),
        transforms.ToTensor(),
    ])
    return transform(image).unsqueeze(0)

@app.route('/upload', methods=['OPTIONS'])
def handle_preflight():
    response_headers = {
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    return "", 204, response_headers

@app.route('/upload', methods=['POST'])
@cross_origin(supports_credentials=True)
def upload_image():
    response_headers = {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400, response_headers

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400, response_headers

    try:
        image = Image.open(file).convert("RGB")

        input_tensor = preprocess_image(image).to(device)

        with torch.no_grad():
            predicted_mask = model(input_tensor)
            predicted_mask = torch.sigmoid(predicted_mask)
            predicted_mask = (predicted_mask > 0.5).float().squeeze().cpu().numpy()

        return jsonify({
            "mask_array": predicted_mask.tolist(),
        }), 200, response_headers

    except Exception as e:
        return jsonify({"error": str(e)}), 500, response_headers

if __name__ == '__main__':
    app.run(debug=True, port=5000)