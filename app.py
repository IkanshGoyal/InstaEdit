from flask import Flask, request, jsonify, send_file
import numpy as np
from PIL import Image
import io
import torch
from torchvision import transforms
from model import UNet 

app = Flask(__name__)

model = UNet()  
model.load_state_dict(torch.load('model_2_epoch_30.pth'))
model.eval()

preprocess = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    image = Image.open(file.stream).convert('RGB')
    image = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        mask = torch.argmax(output, dim=1).squeeze().cpu().numpy()

    mask_image = Image.fromarray((mask * 255).astype(np.uint8))

    buf = io.BytesIO()
    mask_image.save(buf, format='PNG')
    buf.seek(0)

    return send_file(buf, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)