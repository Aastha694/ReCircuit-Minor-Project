import kagglehub
import os

path = kagglehub.dataset_download("akshat103/e-waste-image-dataset")
print("Path to dataset files:", path)

for root, dirs, files in os.walk(path):
    print(f"Directory: {root}")
    for d in dirs:
        print(f"  Dir: {d}")
    if files:
        print(f"  Files: {len(files)} files")
