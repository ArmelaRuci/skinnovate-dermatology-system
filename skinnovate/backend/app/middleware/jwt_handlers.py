"""JWT error handlers and RBAC decorators."""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.models.user import User


def register_jwt_handlers(jwt):
    @jwt.expired_token_loader
    def expired_token(_jwt_header, _jwt_payload):
        return jsonify({"error": "Token has expired", "code": "TOKEN_EXPIRED"}), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({"error": "Invalid token", "reason": reason}), 422

    @jwt.unauthorized_loader
    def missing_token(reason):
        return jsonify({"error": "Authorization required", "reason": reason}), 401

    @jwt.revoked_token_loader
    def revoked_token(_jwt_header, _jwt_payload):
        return jsonify({"error": "Token has been revoked"}), 401


def role_required(*roles):
    """Decorator to restrict endpoint access by role."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or user.role not in roles:
                return jsonify({"error": "Insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def patient_required(fn):
    return role_required("patient")(fn)


def doctor_required(fn):
    return role_required("dermatologist")(fn)


def admin_required(fn):
    return role_required("admin")(fn)


def doctor_or_admin_required(fn):
    return role_required("dermatologist", "admin")(fn)
