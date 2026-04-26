"""Auth API routes: /api/auth/"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from app.services.auth_service import register_user, authenticate_user, generate_tokens
from app.utils.response import success, error
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True)
    if not data:
        return error("Request body required")

    required = ["email", "password", "full_name"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return error(f"Missing fields: {', '.join(missing)}")

    if len(data["password"]) < 8:
        return error("Password must be at least 8 characters")

    user, err = register_user(data)
    if err:
        return error(err)

    tokens = generate_tokens(user)
    return success(tokens, "Registration successful", 201)


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True)
    if not data or not data.get("email") or not data.get("password"):
        return error("Email and password required")

    user, err = authenticate_user(data["email"], data["password"])
    if err:
        return error(err, 401)

    tokens = generate_tokens(user)
    return success(tokens, "Login successful")


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    user    = User.query.get(user_id)
    if not user or not user.is_active:
        return error("User not found", 404)

    new_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "email": user.email},
    )
    return success({"access_token": new_token})


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user    = User.query.get(user_id)
    if not user:
        return error("User not found", 404)

    data = user.to_dict()
    if user.role == "patient" and user.patient_profile:
        data["profile"] = user.patient_profile.to_dict()
    elif user.role == "dermatologist" and user.dermatologist_profile:
        data["profile"] = user.dermatologist_profile.to_dict()
    return success(data)
