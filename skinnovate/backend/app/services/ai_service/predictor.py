"""
AI Skin Condition Predictor
-----------------------------
Converts Jupyter-notebook model logic into a production-ready service.

Design decisions:
  - Model is loaded ONCE at startup (lazy singleton via _load_model).
  - Falls back to a mock predictor when no model file exists (dev/test).
  - All heavy imports are deferred to keep startup fast if TF is large.
  - Returns a structured PredictionResult dataclass for type safety.
"""

from __future__ import annotations

import os
import logging
from dataclasses import dataclass, field
from typing import Optional

import numpy as np

from app.services.ai_service.preprocessor import preprocess_image

logger = logging.getLogger(__name__)


# ── Skin condition labels (must match training label order) ──────────────────
CONDITION_LABELS = [
    "Acne",
    "Eczema",
    "Psoriasis",
    "Rosacea",
    "Melanoma",
    "Basal Cell Carcinoma",
    "Seborrheic Keratosis",
    "Tinea Ringworm",
    "Chickenpox",
    "Normal Skin",
]

SEVERITY_MAP = {
    "Melanoma":              "high",
    "Basal Cell Carcinoma":  "high",
    "Psoriasis":             "medium",
    "Eczema":                "medium",
    "Acne":                  "low",
    "Rosacea":               "low",
    "Seborrheic Keratosis":  "medium",
    "Tinea Ringworm":        "low",
    "Chickenpox":            "medium",
    "Normal Skin":           "low",
}


@dataclass
class PredictionResult:
    predicted_condition:   str
    confidence_score:      float
    severity:              str
    requires_consultation: bool
    all_predictions:       list[dict] = field(default_factory=list)
    error:                 Optional[str] = None


# ── Singleton model holder ────────────────────────────────────────────────────
_model = None


def _load_model(model_path: str):
    """Load (or return cached) TensorFlow/Keras model."""
    global _model
    if _model is not None:
        return _model

    if not os.path.exists(model_path):
        logger.warning("Model file not found at %s – using mock predictor.", model_path)
        return None

    try:
        import tensorflow as tf          # deferred import
        _model = tf.keras.models.load_model(model_path)
        logger.info("AI model loaded from %s", model_path)
        return _model
    except Exception as exc:
        logger.error("Failed to load AI model: %s", exc)
        return None


def _mock_predict(image_path: str) -> PredictionResult:
    """Deterministic mock for development / when model is absent."""
    import hashlib
    digest = int(hashlib.md5(image_path.encode()).hexdigest(), 16)
    idx    = digest % len(CONDITION_LABELS)
    cond   = CONDITION_LABELS[idx]
    conf   = 0.55 + (digest % 40) / 100.0          # 0.55 – 0.94

    top_k = []
    for i, label in enumerate(CONDITION_LABELS):
        score = max(0.0, conf - abs(i - idx) * 0.08)
        top_k.append({"condition": label, "score": round(score, 4)})
    top_k.sort(key=lambda x: x["score"], reverse=True)

    severity = SEVERITY_MAP.get(cond, "low")
    return PredictionResult(
        predicted_condition=cond,
        confidence_score=round(conf, 4),
        severity=severity,
        requires_consultation=(conf < 0.70 or severity == "high"),
        all_predictions=top_k[:5],
    )


def predict(image_path: str, model_path: str, confidence_threshold: float = 0.70) -> PredictionResult:
    """Run inference on a single skin image.

    Args:
        image_path:           Absolute path to the uploaded image.
        model_path:           Path to the saved Keras .h5 model.
        confidence_threshold: Below this score, consultation is required.

    Returns:
        PredictionResult with all fields populated.
    """
    model = _load_model(model_path)

    # ── Mock path (no model file available) ──────────────────────────────
    if model is None:
        return _mock_predict(image_path)

    # ── Real inference ────────────────────────────────────────────────────
    try:
        img_array  = preprocess_image(image_path)          # (1, 224, 224, 3)
        raw_output = model.predict(img_array, verbose=0)   # (1, N)
        probs      = raw_output[0]                         # (N,)

        top_idx  = int(np.argmax(probs))
        top_conf = float(probs[top_idx])
        cond     = CONDITION_LABELS[top_idx] if top_idx < len(CONDITION_LABELS) else "Unknown"

        # Build top-5 predictions list
        sorted_idx = np.argsort(probs)[::-1][:5]
        top_k = [
            {
                "condition": CONDITION_LABELS[i] if i < len(CONDITION_LABELS) else f"Class {i}",
                "score":     round(float(probs[i]), 4),
            }
            for i in sorted_idx
        ]

        severity = SEVERITY_MAP.get(cond, "medium")
        requires = (top_conf < confidence_threshold) or (severity == "high")

        return PredictionResult(
            predicted_condition=cond,
            confidence_score=round(top_conf, 4),
            severity=severity,
            requires_consultation=requires,
            all_predictions=top_k,
        )

    except Exception as exc:
        logger.error("Inference error for %s: %s", image_path, exc)
        return PredictionResult(
            predicted_condition="Unknown",
            confidence_score=0.0,
            severity="high",
            requires_consultation=True,
            all_predictions=[],
            error=str(exc),
        )
