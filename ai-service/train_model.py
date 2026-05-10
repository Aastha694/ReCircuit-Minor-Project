import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing import image_dataset_from_directory

# ─── Configuration ────────────────────────────────────────────────────────────
DATASET_DIR = os.path.join(os.path.dirname(__file__), 'dataset')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
LEARNING_RATE = 0.001

CATEGORIES = ['battery', 'circuit_board', 'laptop_tablet', 'mobile_device', 'other']

def build_model():
    """Builds the MobileNetV2 transfer learning model."""
    print("Loading MobileNetV2 base model...")
    # Base model pre-trained on ImageNet
    base_model = MobileNetV2(
        weights='imagenet', 
        include_top=False, 
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)
    )

    # Freeze the base model to retain general feature extraction
    base_model.trainable = False

    # Custom Head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(len(CATEGORIES), activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def main():
    # Check if dataset directory exists
    if not os.path.exists(DATASET_DIR):
        print(f"❌ Dataset directory not found at: {DATASET_DIR}")
        print("\nPlease create the following folder structure and add your images:")
        print("ai-service/")
        print(" └── dataset/")
        for cat in CATEGORIES:
            print(f"      ├── {cat}/")
        print("\nSupported formats: JPEG, PNG.")
        print("You can download datasets from Kaggle/Roboflow as recommended in your plan.")
        return

    print("Loading dataset...")
    # Load training data
    train_dataset = image_dataset_from_directory(
        DATASET_DIR,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='int',
        class_names=CATEGORIES # Enforce class ordering
    )

    # Load validation data
    val_dataset = image_dataset_from_directory(
        DATASET_DIR,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode='int',
        class_names=CATEGORIES
    )

    # Normalize data using rescaling (MobileNetV2 expects [-1, 1] but usually it's handled, 
    # actually MobileNetV2 expects [-1, 1], so we use preprocess_input or Rescaling(1./127.5, offset=-1))
    normalization_layer = tf.keras.layers.Rescaling(1./127.5, offset=-1)
    train_dataset = train_dataset.map(lambda x, y: (normalization_layer(x), y))
    val_dataset = val_dataset.map(lambda x, y: (normalization_layer(x), y))

    # Prefetching for performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_dataset = train_dataset.cache().prefetch(buffer_size=AUTOTUNE)
    val_dataset = val_dataset.cache().prefetch(buffer_size=AUTOTUNE)

    # Build model
    model = build_model()
    model.summary()

    # Callbacks
    os.makedirs(MODEL_DIR, exist_ok=True)
    best_model_path = os.path.join(MODEL_DIR, 'model.h5')
    checkpoint = tf.keras.callbacks.ModelCheckpoint(
        best_model_path, 
        monitor='val_accuracy', 
        save_best_only=True, 
        mode='max', 
        verbose=1
    )
    early_stopping = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=3,
        restore_best_weights=True
    )

    print("\nStarting training...")
    history = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=EPOCHS,
        callbacks=[checkpoint, early_stopping]
    )

    print(f"\nTraining complete! Best model saved to {best_model_path}")
    print("You can now restart your Flask AI service to use the trained model.")

if __name__ == "__main__":
    main()
