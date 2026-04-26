"""Appointment routes: /api/appointments/"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from app import db
from app.models.user import User
from app.models.patient import Patient
from app.models.dermatologist import Dermatologist
from app.models.appointment import Appointment
from app.utils.response import success, error
from app.middleware.jwt_handlers import role_required

appointments_bp = Blueprint("appointments", __name__)


def _get_patient(user_id):
    return Patient.query.filter_by(user_id=user_id).first()


def _get_doctor(user_id):
    return Dermatologist.query.filter_by(user_id=user_id).first()


@appointments_bp.post("/")
@jwt_required()
def book_appointment():
    user_id = int(get_jwt_identity())
    user    = User.query.get(user_id)
    data    = request.get_json(silent=True) or {}

    patient = _get_patient(user_id) if user.role == "patient" else None
    if user.role == "patient" and not patient:
        return error("Patient profile not found", 404)

    # Validate required fields
    if not data.get("scheduled_at"):
        return error("scheduled_at is required")

    try:
        scheduled = datetime.fromisoformat(data["scheduled_at"])
    except ValueError:
        return error("Invalid date format. Use ISO 8601")

    if scheduled <= datetime.utcnow():
        return error("Appointment must be in the future")

    appt = Appointment(
        patient_id=patient.id if patient else data.get("patient_id"),
        dermatologist_id=data.get("dermatologist_id"),
        scheduled_at=scheduled,
        appointment_type=data.get("appointment_type", "in_person"),
        reason=data.get("reason"),
        is_emergency=data.get("is_emergency", False),
        status="requested" if not data.get("dermatologist_id") else "scheduled",
    )
    db.session.add(appt)
    db.session.commit()
    return success(appt.to_dict(), "Appointment booked", 201)


@appointments_bp.get("/")
@jwt_required()
def list_appointments():
    user_id = int(get_jwt_identity())
    user    = User.query.get(user_id)

    if user.role == "patient":
        patient = _get_patient(user_id)
        query   = Appointment.query.filter_by(patient_id=patient.id)
    elif user.role == "dermatologist":
        doctor = _get_doctor(user_id)
        query  = Appointment.query.filter_by(dermatologist_id=doctor.id)
    else:
        query  = Appointment.query

    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)

    appts = query.order_by(Appointment.scheduled_at.asc()).all()
    return success([a.to_dict() for a in appts])


@appointments_bp.get("/<int:appt_id>")
@jwt_required()
def get_appointment(appt_id):
    appt = Appointment.query.get_or_404(appt_id)
    data = appt.to_dict()
    if appt.dermatologist and appt.dermatologist.user:
        data["dermatologist_name"] = appt.dermatologist.user.full_name
    if appt.patient and appt.patient.user:
        data["patient_name"] = appt.patient.user.full_name
    return success(data)


@appointments_bp.patch("/<int:appt_id>")
@jwt_required()
def update_appointment(appt_id):
    user_id = int(get_jwt_identity())
    user    = User.query.get(user_id)
    appt    = Appointment.query.get_or_404(appt_id)
    data    = request.get_json(silent=True) or {}

    # Patients can only reschedule/cancel their own
    if user.role == "patient":
        patient = _get_patient(user_id)
        if appt.patient_id != patient.id:
            return error("Forbidden", 403)
        allowed = {"scheduled_at", "reason", "status"}
        if "status" in data and data["status"] not in ("cancelled",):
            return error("Patients can only cancel appointments")
    else:
        allowed = {"status", "notes", "dermatologist_id", "scheduled_at"}

    for key in allowed:
        if key in data:
            if key == "scheduled_at":
                try:
                    setattr(appt, key, datetime.fromisoformat(data[key]))
                except ValueError:
                    return error("Invalid date format")
            else:
                setattr(appt, key, data[key])

    db.session.commit()
    return success(appt.to_dict(), "Appointment updated")


@appointments_bp.get("/doctors/available")
@jwt_required()
def available_doctors():
    doctors = Dermatologist.query.filter_by(is_available=True).all()
    result  = []
    for d in doctors:
        info = d.to_dict()
        if d.user:
            info["full_name"] = d.user.full_name
            info["email"]     = d.user.email
        result.append(info)
    return success(result)
