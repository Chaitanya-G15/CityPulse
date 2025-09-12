import torch
import torch.nn as nn
import torchvision.transforms as T
from flask import Flask, request, render_template_string
from PIL import Image
import io
import numpy as np
import matplotlib.pyplot as plt
import base64

# =========================
# Model Architecture
# =========================
class UNetSmall(nn.Module):
    def __init__(self):
        super().__init__()
        self.enc1 = nn.Sequential(nn.Conv2d(3, 16, 3, padding=1), nn.ReLU())
        self.enc2 = nn.Sequential(nn.Conv2d(16, 32, 3, padding=1), nn.ReLU())
        self.pool = nn.MaxPool2d(2, 2)
        self.up = nn.ConvTranspose2d(32, 16, 2, stride=2)
        self.dec1 = nn.Sequential(nn.Conv2d(32, 16, 3, padding=1), nn.ReLU())
        self.final = nn.Conv2d(16, 1, 1)

    def forward(self, x):
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool(e1))
        d1 = self.up(e2)
        d1 = torch.cat([d1, e1], dim=1)
        d1 = self.dec1(d1)
        return torch.sigmoid(self.final(d1))

# =========================
# Setup
# =========================
device = torch.device("cpu")
model = UNetSmall().to(device)

try:
    model.load_state_dict(torch.load("best_citypulse_unet.pt", map_location=device))
    print("✅ Model weights loaded.")
except:
    print("⚠️ No pretrained weights found — using random untrained model.")

model.eval()

transform = T.Compose([
    T.Resize((128, 128)),
    T.ToTensor(),
])

# =========================
# Flask App
# =========================
app = Flask(__name__)

HTML_TEMPLATE = """
<!doctype html>
<html>
<head>
    <title>CityPulse Segmentation</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        .images { display: flex; justify-content: center; gap: 30px; }
        .images img { width: 400px; height: auto; border: 2px solid #ccc; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>CityPulse UNet Segmentation</h1>
    <form action="/predict" method="post" enctype="multipart/form-data">
        <p><input type="file" name="file" required></p>
        <p><input type="submit" value="Upload & Predict"></p>
    </form>

    {% if orig and pred %}
    <div class="images">
        <div>
            <h3>Uploaded Image</h3>
            <img src="data:image/png;base64,{{ orig }}">
        </div>
        <div>
            <h3>Predicted Probability Heatmap</h3>
            <img src="data:image/png;base64,{{ pred }}">
        </div>
    </div>
    {% endif %}
</body>
</html>
"""

@app.route("/", methods=["GET"])
def home():
    return render_template_string(HTML_TEMPLATE, orig=None, pred=None)

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get("file")
    if not file:
        return "No file uploaded", 400

    # Original image
    image = Image.open(file.stream).convert("RGB")
    buf_orig = io.BytesIO()
    image.save(buf_orig, format="PNG")
    buf_orig.seek(0)
    orig_b64 = base64.b64encode(buf_orig.getvalue()).decode("utf-8")

    # Preprocess
    inp = transform(image).unsqueeze(0).to(device)

    # Predict
    with torch.no_grad():
        pred = model(inp)
        prob_map = pred.squeeze().cpu().numpy()

    # Make probability heatmap with bigger figure size
    fig, ax = plt.subplots(figsize=(6, 6))   # increased size
    ax.imshow(prob_map, cmap="viridis")
    ax.axis("off")
    buf_pred = io.BytesIO()
    plt.savefig(buf_pred, format="png", bbox_inches="tight", pad_inches=0, dpi=150)
    plt.close(fig)
    buf_pred.seek(0)
    pred_b64 = base64.b64encode(buf_pred.getvalue()).decode("utf-8")

    return render_template_string(HTML_TEMPLATE, orig=orig_b64, pred=pred_b64)

# =========================
# Run
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005, debug=True)
