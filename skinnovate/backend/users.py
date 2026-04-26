"""File upload helpers."""

import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename


def allowed_image(filename: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in current_app.config.get("ALLOWED_IMAGE_EXTENSIONS", {"jpg", "jpeg", "png", "webp"})


def save_upload(file, subfolder: str = "images") -> tuple[str, str]:
    """Save an uploaded FileStorage and return (filename, absolute_path)."""
    original  = secure_filename(file.filename)
    ext       = original.rsplit(".", 1)[-1].lower()
    unique    = f"{uuid.uuid4().hex}.{ext}"
    folder    = os.path.join(current_app.config["UPLOAD_FOLDER"], subfolder)
    os.makedirs(folder, exist_ok=True)
    full_path = os.path.join(folder, unique)
    file.save(full_path)
    return unique, full_path


def delete_file(filepath: str) -> None:
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
    except OSError:
        pass
