import os
# pyrefly: ignore [missing-import]
import numpy as np
# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
from flask_cors import CORS
# pyrefly: ignore [missing-import]
from PIL import Image


app = Flask(__name__)
CORS(app)

# ─── Model Loading ──────────────────────────────────────────────────────────────
# The model will be loaded once on startup.
# For MVP, we support both a Keras .h5 model and a TFLite model.
# Place your trained model file in ./model/ directory.

MODEL = None
MODEL_TYPE = None  # 'keras' or 'tflite'
CATEGORIES = ['battery', 'circuit_board', 'laptop_tablet', 'mobile_device', 'other']
IMG_SIZE = (224, 224)

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')


def load_model():
    """Attempt to load a trained model from the ./model/ directory."""
    global MODEL, MODEL_TYPE

    keras_path = os.path.join(MODEL_DIR, 'model.h5')
    tflite_path = os.path.join(MODEL_DIR, 'model.tflite')
    savedmodel_path = os.path.join(MODEL_DIR, 'saved_model')

    if os.path.exists(keras_path):
        import tensorflow as tf
        MODEL = tf.keras.models.load_model(keras_path)
        MODEL_TYPE = 'keras'
        print(f'Loaded Keras model from {keras_path}')
    elif os.path.exists(tflite_path):
        import tensorflow as tf
        MODEL = tf.lite.Interpreter(model_path=tflite_path)
        MODEL.allocate_tensors()
        MODEL_TYPE = 'tflite'
        print(f'Loaded TFLite model from {tflite_path}')
    elif os.path.exists(savedmodel_path):
        import tensorflow as tf
        MODEL = tf.keras.models.load_model(savedmodel_path)
        MODEL_TYPE = 'keras'
        print(f'Loaded SavedModel from {savedmodel_path}')
    else:
        print('No model found in ./model/ — /classify will use random fallback for demo.')
        MODEL_TYPE = 'demo'


def preprocess_image(image_path):
    """Load and preprocess an image for prediction."""
    img = Image.open(image_path).convert('RGB')
    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32)
    # MobileNetV2 expects inputs in the range [-1, 1]
    arr = (arr / 127.5) - 1.0
    arr = np.expand_dims(arr, axis=0)  # (1, 224, 224, 3)
    return arr


def predict(image_path):
    """Run prediction on a single image and return category + confidence."""
    if MODEL_TYPE == 'demo':
        # Demo fallback: return a random but deterministic category
        idx = hash(image_path) % len(CATEGORIES)
        return CATEGORIES[idx], round(0.5 + (hash(image_path) % 50) / 100, 2)

    arr = preprocess_image(image_path)

    if MODEL_TYPE == 'keras':
        preds = MODEL.predict(arr, verbose=0)[0]
    elif MODEL_TYPE == 'tflite':
        input_details = MODEL.get_input_details()
        output_details = MODEL.get_output_details()
        MODEL.set_tensor(input_details[0]['index'], arr)
        MODEL.invoke()
        preds = MODEL.get_tensor(output_details[0]['index'])[0]

    idx = int(np.argmax(preds))
    confidence = float(preds[idx])
    category = CATEGORIES[idx]

    return category, round(confidence, 4)


# ─── Routes ─────────────────────────────────────────────────────────────────────

@app.route('/classify', methods=['POST'])
def classify():
    """Accept an image path and return AI classification."""
    data = request.get_json(silent=True)

    if not data or 'image_path' not in data:
        return jsonify({'error': 'image_path is required'}), 400

    image_path = data['image_path']

    if not os.path.exists(image_path):
        return jsonify({'error': f'Image not found at path: {image_path}'}), 404

    try:
        category, confidence = predict(image_path)
        return jsonify({
            'category': category,
            'confidence': confidence,
        })
    except Exception as e:
        print(f'Classification error: {e}')
        return jsonify({'error': 'Classification failed', 'details': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'model_loaded': MODEL_TYPE is not None,
        'model_type': MODEL_TYPE,
        'categories': CATEGORIES,
    })


# ─── Startup ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    os.makedirs(MODEL_DIR, exist_ok=True)
    load_model()
    print('AI Service running on http://localhost:5000')
    app.run(host='0.0.0.0', port=5000, debug=False)
