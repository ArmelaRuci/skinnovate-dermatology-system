"""User profile routes: /api/users/"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.patient import Patient
from app.models.dermatologist import Dermatologist
from app.utils.response import success, error

users_bp = Blueprint("users", __name__)


@users_bp.patch("/profile")
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user    = User.query.get(user_id)
    data    = request.get_json(silent=True) or {}

    # Update base user
    for field in ("full_name", "phone"):
        if field in data:
            setattr(user, field, data[field])

    # Update role-specific profile
    if user.role == "patient" and user.patient_profile:
        p = user.patient_profile
        for field in ("date_of_birth", "gender", "skin_type", "allergies", "medical_history"):
            if field in data:
                setattr(p, field, data[field])

    elif user.role == "dermatologist" and user.dermatologist_profile:
        d = user.dermatologist_profile
        for field in ("specialization", "bio", "years_experience", "is_available"):
            if field in data:
                setattr(d, field, data[field])

    db.session.commit()
    result = user.to_dict()
    if user.role == "patient" and user.patient_profile:
        result["profile"] = user.patient_profile.to_dict()
    elif user.role == "dermatologist" and user.dermatologist_profile:
        result["profile"] = user.dermatologist_profile.to_dict()
    return success(result, "Profile updated")


@users_bp.get("/dermatologists")
@jwt_required()
def list_dermatologists():
    doctors = Dermatologist.query.all()
    result  = []
    for d in doctors:
        info = d.to_dict()
        if d.user:
            info.update({"full_name": d.user.full_name, "email": d.user.email})
        result.append(info)
    return success(result)
