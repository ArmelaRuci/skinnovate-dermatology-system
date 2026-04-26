"""Authentication service – registration, login, token management."""

from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, create_refresh_token
from app import db, bcrypt
from app.models.user import User
from app.models.patient import Patient
from app.models.dermatologist import Dermatologist


def register_user(data: dict) -> tuple[User, str]:
    """Create a new user and matching role profile.

    Returns:
        (user, error_message) – error_message is None on success.
    """
    if User.query.filter_by(email=data["email"].lower().strip()).first():
        return None, "Email already registered"

    pw_hash = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    user = User(
        email=data["email"].lower().strip(),
        password_hash=pw_hash,
        full_name=data["full_name"].strip(),
        phone=data.get("phone"),
        role=data.get("role", "patient"),
    )
    db.session.add(user)
    db.session.flush()   # get user.id before commit

    # Create role-specific profile
    if user.role == "patient":
        profile = Patient(
            user_id=user.id,
            skin_type=data.get("skin_type"),
        )
        db.session.add(profile)

    elif user.role == "dermatologist":
        license_no = data.get("license_number")
        if not license_no:
            db.session.rollback()
            return None, "License number is required for dermatologists"
        profile = Dermatologist(
            user_id=user.id,
            license_number=license_no,
            specialization=data.get("specialization"),
        )
        db.session.add(profile)

    db.session.commit()
    return user, None


def authenticate_user(email: str, password: str) -> tuple[User, str]:
    """Verify credentials. Returns (user, error_message)."""
    user = User.query.filter_by(email=email.lower().strip()).first()
    if not user:
        return None, "Invalid email or password"
    if not user.is_active:
        return None, "Account is deactivated"
    if not bcrypt.check_password_hash(user.password_hash, password):
        return None, "Invalid email or password"
    return user, None


def generate_tokens(user: User) -> dict:
    """Return both access and refresh JWT tokens."""
    identity = str(user.id)
    additional_claims = {"role": user.role, "email": user.email}
    return {
        "access_token":  create_access_token(identity=identity, additional_claims=additional_claims),
        "refresh_token": create_refresh_token(identity=identity),
        "user":          user.to_dict(),
    }
