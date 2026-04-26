"""
Image preprocessing pipeline.
Mirrors exactly what was done during model training so inference is consistent.
"""

import numpy as np
from PIL import Image, ImageOps


# ── Constants (must match training config) ────────────────────────────────────
TARGET_SIZE  = (224, 224)
MEAN         = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD          = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def preprocess_image(image_path: str) -> np.ndarray:
    """Load an image from disk and return a model-ready numpy array.

    Steps:
        1. Open & convert to RGB (drops alpha channel if PNG)
        2. Auto-orient via EXIF (fixes rotated phone photos)
        3. Resize to TARGET_SIZE using high-quality Lanczos resampling
        4. Normalize to [0, 1] then apply ImageNet mean/std
        5. Add batch dimension  → shape (1, 224, 224, 3)

    Args:
        image_path: Absolute path to the image file.

    Returns:
        np.ndarray of shape (1, H, W, 3) and dtype float32.
    """
    img = Image.open(image_path).convert("RGB")
    img = ImageOps.exif_transpose(img)                          # honour EXIF rotation
    img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)

    arr  = np.array(img, dtype=np.float32) / 255.0             # → [0, 1]
    arr  = (arr - MEAN) / STD                                   # ImageNet normalisation
    return np.expand_dims(arr, axis=0)                          # (1, 224, 224, 3)


def preprocess_from_bytes(image_bytes: bytes) -> np.ndarray:
    """Accept raw bytes (e.g. from request.files) instead of a file path."""
    import io
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = ImageOps.exif_transpose(img)
    img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    arr  = np.array(img, dtype=np.float32) / 255.0
    arr  = (arr - MEAN) / STD
    return np.expand_dims(arr, axis=0)
