"""EHR / patient records routes: /api/records/"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.patient import Patient
from app.models.medical_note import MedicalNote
from app.models.prescription import Prescription
from app.utils.response import success, error
from app.middleware.jwt_handlers import role_required

records_bp = Blueprint("records", __name__)


@records_bp.get("/patient/<int:patient_id>")
@jwt_required()
def patient_record(patient_id):
    user_id = int(get_jwt_identity())
    user    = User.query.get(user_id)

    patient = Patient.query.get_or_404(patient_id)

    # Access control: patients can only see their own
    if user.role == "patient" and patient.user_id != user_id:
        return error("Forbidden", 403)

    # Fetch all related data
    notes   = MedicalNote.query.filter_by(patient_id=patient_id).order_by(MedicalNote.note_date.desc()).all()
    scripts = Prescription.query.filter_by(patient_id=patient_id).order_by(Prescription.issued_at.desc()).all()
    images  = patient.skin_images

    return success({
        "patient":       patient.to_dict(),
        "user":          patient.user.to_dict() if patient.user else None,
        "medical_notes": [n.to_dict() for n in notes],
        "prescriptions": [p.to_dict() for p in scripts],
        "skin_images":   [i.to_dict() for i in images],
    })


@records_bp.post("/notes")
@jwt_required()
@role_required("dermatologist", "admin")
def create_note():
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    from app.models.dermatologist import Dermatologist
    doctor = Dermatologist.query.filter_by(user_id=user_id).first()
    if not doctor:
        return error("Dermatologist profile not found", 404)

    required = ["appointment_id", "patient_id", "note_text"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return error(f"Missing: {', '.join(missing)}")

    note = MedicalNote(
        appointment_id=data["appointment_id"],
        dermatologist_id=doctor.id,
        patient_id=data["patient_id"],
        diagnosis_id=data.get("diagnosis_id"),
        note_text=data["note_text"],
    )
    db.session.add(note)
    db.session.commit()
    return success(note.to_dict(), "Note saved", 201)


@records_bp.post("/prescriptions")
@jwt_required()
@role_required("dermatologist")
def create_prescription():
    user_id = int(get_jwt_identity())
    data    = request.get_json(silent=True) or {}

    from app.models.dermatologist import Dermatologist
    doctor = Dermatologist.query.filter_by(user_id=user_id).first()

    rx = Prescription(
        patient_id=data["patient_id"],
        dermatologist_id=doctor.id,
        appointment_id=data.get("appointment_id"),
        medications=data.get("medications", []),
        notes=data.get("notes"),
    )
    db.session.add(rx)
    db.session.commit()
    return success(rx.to_dict(), "Prescription created", 201)


@records_bp.get("/my")
@jwt_required()
def my_records():
    """Shortcut for patients to get their own records."""
    user_id = int(get_jwt_identity())
    user    = User.query.get(user_id)
    if user.role != "patient":
        return error("Patients only", 403)

    patient = Patient.query.filter_by(user_id=user_id).first()
    if not patient:
        return error("Patient profile not found", 404)

    notes   = MedicalNote.query.filter_by(patient_id=patient.id).order_by(MedicalNote.note_date.desc()).all()
    scripts = Prescription.query.filter_by(patient_id=patient.id).order_by(Prescription.issued_at.desc()).all()

    return success({
        "medical_notes": [n.to_dict() for n in notes],
        "prescriptions": [p.to_dict() for p in scripts],
    })
