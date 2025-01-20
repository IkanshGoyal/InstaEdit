from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import torch
from PIL import Image
from torchvision import transforms
import io
import base64

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the traced model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = torch.jit.load("object_mask_models/traced_model.pt", map_location=torch.device("cpu"))
model.to(device)
model.eval()

# Define image preprocessing
def preprocess_image(image, img_size=(256, 256)):
    transform = transforms.Compose([
        transforms.Resize(img_size),
        transforms.ToTensor(),
    ])
    return transform(image).unsqueeze(0)  # Add batch dimension

@app.route('/upload', methods=['OPTIONS'])
def handle_preflight():
    response_headers = {
        "Access-Control-Allow-Origin": "http://localhost:3000",
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
        # Load the uploaded image
        image = Image.open(file).convert("RGB")
        original_width, original_height = image.size  # Get original dimensions

        # Preprocess the image
        input_tensor = preprocess_image(image).to(device)

        # Predict the mask
        with torch.no_grad():
            predicted_mask = model(input_tensor)
            predicted_mask = torch.sigmoid(predicted_mask)
            predicted_mask = (predicted_mask > 0.5).float().squeeze().cpu().numpy()

        # Convert the mask to a PIL Image
        mask_image = Image.fromarray((predicted_mask * 255).astype("uint8"))

        # Save the mask image to a BytesIO object
        buf = io.BytesIO()
        mask_image.save(buf, format="PNG")
        buf.seek(0)

        # Encode the binary mask in Base64
        base64_image = base64.b64encode(buf.read()).decode("utf-8")

        # Return the Base64 encoded mask, mask array, and original dimensions
        return jsonify({
            "mask": base64_image,
            "mask_array": predicted_mask.tolist(),  # Convert numpy array to list
            "original_width": original_width,
            "original_height": original_height,
        }), 200, response_headers

    except Exception as e:
        return jsonify({"error": str(e)}), 500, response_headers

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5000)