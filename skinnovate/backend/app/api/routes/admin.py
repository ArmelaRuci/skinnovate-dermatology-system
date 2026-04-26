"""Admin routes: /api/admin/"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from app import db
from app.models.user import User
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.ai_diagnosis import AIDiagnosis
from app.utils.response import success, error
from app.middleware.jwt_handlers import admin_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/stats")
@jwt_required()
@admin_required
def stats():
    total_patients     = Patient.query.count()
    total_appointments = Appointment.query.count()
    pending_appts      = Appointment.query.filter_by(status="requested").count()
    total_analyses     = AIDiagnosis.query.count()
    unvalidated        = AIDiagnosis.query.filter_by(doctor_confirmed=None).count()

    return success({
        "total_patients":       total_patients,
        "total_appointments":   total_appointments,
        "pending_appointments": pending_appts,
        "total_analyses":       total_analyses,
        "unvalidated_diagnoses": unvalidated,
    })


@admin_bp.get("/users")
@jwt_required()
@admin_required
def list_users():
    role  = request.args.get("role")
    query = User.query
    if role:
        query = query.filter_by(role=role)
    users = query.order_by(User.created_at.desc()).all()
    return success([u.to_dict() for u in users])


@admin_bp.patch("/users/<int:user_id>/toggle")
@jwt_required()
@admin_required
def toggle_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    status = "activated" if user.is_active else "deactivated"
    return success(user.to_dict(), f"User {status}")


@admin_bp.get("/appointments/pending")
@jwt_required()
@admin_required
def pending_appointments():
    appts = Appointment.query.filter(
        Appointment.status.in_(["requested", "scheduled"])
    ).order_by(Appointment.scheduled_at.asc()).all()

    result = []
    for a in appts:
        d = a.to_dict()
        if a.patient and a.patient.user:
            d["patient_name"] = a.patient.user.full_name
        result.append(d)
    return success(result)
