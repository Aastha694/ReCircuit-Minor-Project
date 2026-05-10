import kagglehub
import os
import shutil

# Target directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')

TARGET_CATEGORIES = {
    'battery': 'battery',
    'circuit_board': 'circuit_board',
    'laptop_tablet': 'laptop_tablet',
    'mobile_device': 'mobile_device',
    'other': 'other'
}

# Mapping from Kaggle dataset folders to our target folders
# Kaggle dataset has: Battery, Keyboard, Microwave, Mobile, Mouse, PCB, Player, Printer, Television, Washing Machine
MAPPING = {
    'Battery': 'battery',
    'PCB': 'circuit_board',
    'Mobile': 'mobile_device',
    # Everything else goes to 'other'
    'Keyboard': 'other',
    'Microwave': 'other',
    'Mouse': 'other',
    'Player': 'other',
    'Printer': 'other',
    'Television': 'other',
    'Washing Machine': 'other'
}

def main():
    print("Downloading dataset via kagglehub...")
    path = kagglehub.dataset_download("akshat103/e-waste-image-dataset")
    print(f"Dataset downloaded to: {path}")

    # Ensure target dataset directory exists
    for cat in TARGET_CATEGORIES.values():
        os.makedirs(os.path.join(DATASET_DIR, cat), exist_ok=True)

    copied_count = {cat: 0 for cat in TARGET_CATEGORIES.values()}

    # The dataset has 'modified-dataset' or 'original-dataset'. Let's use 'modified-dataset' which has train/val splits
    # We will merge train and val because train_model.py uses validation_split=0.2
    search_dirs = [
        os.path.join(path, 'modified-dataset', 'train'),
        os.path.join(path, 'modified-dataset', 'val')
    ]

    for s_dir in search_dirs:
        if not os.path.exists(s_dir):
            continue
        
        for folder_name in os.listdir(s_dir):
            if folder_name not in MAPPING:
                continue
            
            target_cat = MAPPING[folder_name]
            src_folder = os.path.join(s_dir, folder_name)
            target_folder = os.path.join(DATASET_DIR, target_cat)
            
            if not os.path.isdir(src_folder):
                continue
                
            for file_name in os.listdir(src_folder):
                src_file = os.path.join(src_folder, file_name)
                # To prevent filename collisions, prepend the original folder name
                dst_file_name = f"{folder_name}_{file_name}"
                dst_file = os.path.join(target_folder, dst_file_name)
                
                # Copy file
                shutil.copy2(src_file, dst_file)
                copied_count[target_cat] += 1

    print("\nDataset Preparation Complete!")
    print("Files organized into target categories:")
    for cat, count in copied_count.items():
        print(f" - {cat}: {count} images")
    
    if copied_count['laptop_tablet'] == 0:
        print("\nWARNING: No images were found for 'laptop_tablet' in this dataset.")
        print("Please manually download some laptop/tablet images and place them in: ai-service/dataset/laptop_tablet/")

if __name__ == "__main__":
    main()
