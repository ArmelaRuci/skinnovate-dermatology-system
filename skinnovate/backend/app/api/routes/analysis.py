"""Analysis routes: /api/analysis/ – image upload + AI inference."""

from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone

from app import db
from app.models.user import User
from app.models.patient import Patient
from app.models.skin_image import SkinImage
from app.models.ai_diagnosis import AIDiagnosis
from app.services.ai_service.predictor import predict
from app.utils.file_utils import allowed_image, save_upload
from app.utils.response import success, error
from app.middleware.jwt_handlers import role_required

analysis_bp = Blueprint("analysis", __name__)


@analysis_bp.post("/upload")
@jwt_required()
def upload_and_analyze():
    """Upload a skin image and run AI inference immediately.

    Multipart form fields:
      - image (file)          : required
      - description (str)     : optional
      - body_area (str)       : optional, e.g. "left cheek"
    """
    user_id = int(get_jwt_identity())
    user    = User.query.get(user_id)
    if not user:
        return error("User not found", 404)

    # Only patients can upload
    if user.role != "patient":
        return error("Only patients can upload skin images", 403)

    patient = Patient.query.filter_by(user_id=user_id).first()
    if not patient:
        return error("Patient profile not found", 404)

    # ── Validate file ──────────────────────────────────────────────────────
    if "image" not in request.files:
        return error("No image file provided")

    file = request.files["image"]
    if not file or not file.filename:
        return error("Empty file")

    if not allowed_image(file.filename):
        return error("Unsupported file type. Use JPG, PNG, or WebP")

    # ── Save file ──────────────────────────────────────────────────────────
    filename, filepath = save_upload(file, subfolder="skin_images")

    skin_image = SkinImage(
        patient_id=patient.id,
        filename=filename,
        filepath=filepath,
        description=request.form.get("description"),
        body_area=request.form.get("body_area"),
    )
    db.session.add(skin_image)
    db.session.flush()

    # ── Run AI inference ───────────────────────────────────────────────────
    model_path  = current_app.config["AI_MODEL_PATH"]
    threshold   = current_app.config["AI_CONFIDENCE_THRESHOLD"]
    result      = predict(filepath, model_path, threshold)

    diagnosis = AIDiagnosis(
        skin_image_id=skin_image.id,
        predicted_condition=result.predicted_condition,
        confidence_score=result.confidence_score,
        all_predictions=result.all_predictions,
        severity=result.severity,
        requires_consultation=result.requires_consultation,
    )
    db.session.add(diagnosis)
    db.session.commit()

    # Award loyalty points for using AI analysis
    patient.loyalty_points = (patient.loyalty_points or 0) + 5
    db.session.commit()

    return success(
        {
            "image":     skin_image.to_dict(),
            "diagnosis": diagnosis.to_dict(),
        },
        "Analysis complete",
        201,
    )


@analysis_bp.get("/history")
@jwt_required()
def analysis_history():
    """Return all AI analyses for the current patient."""
    user_id = int(get_jwt_identity())
    user    = User.query.get(user_id)

    if user.role == "patient":
        patient = Patient.query.filter_by(user_id=user_id).first()
        if not patient:
            return error("Patient profile not found", 404)
        images = SkinImage.query.filter_by(patient_id=patient.id).order_by(SkinImage.uploaded_at.desc()).all()
    else:
        # Doctors/admins can view all
        images = SkinImage.query.order_by(SkinImage.uploaded_at.desc()).limit(50).all()

    results = []
    for img in images:
        entry = img.to_dict()
        if img.diagnosis:
            entry["diagnosis"] = img.diagnosis.to_dict()
        results.append(entry)

    return success(results)


@analysis_bp.get("/<int:diagnosis_id>")
@jwt_required()
def get_diagnosis(diagnosis_id):
    diag = AIDiagnosis.query.get_or_404(diagnosis_id)
    return success(diag.to_dict())


@analysis_bp.patch("/<int:diagnosis_id>/validate")
@jwt_required()
@role_required("dermatologist", "admin")
def validate_diagnosis(diagnosis_id):
    """Doctor confirms or overrides the AI diagnosis."""
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    diag = AIDiagnosis.query.get_or_404(diagnosis_id)
    diag.doctor_confirmed = data.get("confirmed", True)
    diag.doctor_diagnosis = data.get("doctor_diagnosis", diag.predicted_condition)
    diag.validated_by     = user_id
    diag.validated_at     = datetime.now(timezone.utc)

    db.session.commit()
    return success(diag.to_dict(), "Diagnosis validated")
