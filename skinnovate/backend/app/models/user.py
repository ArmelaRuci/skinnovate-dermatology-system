"""
User model – base identity for all roles.
Roles: patient | dermatologist | admin
"""

from datetime import datetime, timezone
from app import db


class User(db.Model):
    __tablename__ = "users"

    id           = db.Column(db.Integer,     primary_key=True)
    email        = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash= db.Column(db.String(255), nullable=False)
    full_name    = db.Column(db.String(150), nullable=False)
    phone        = db.Column(db.String(20),  nullable=True)
    role         = db.Column(
                       db.Enum("patient", "dermatologist", "admin", name="user_role"),
                       nullable=False,
                       default="patient",
                   )
    is_active    = db.Column(db.Boolean, default=True)
    created_at   = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at   = db.Column(
                       db.DateTime,
                       default=lambda: datetime.now(timezone.utc),
                       onupdate=lambda: datetime.now(timezone.utc),
                   )

    # ── Relationships ──────────────────────────────────────────────────────
    patient_profile      = db.relationship("Patient",       back_populates="user", uselist=False, cascade="all, delete-orphan")
    dermatologist_profile= db.relationship("Dermatologist", back_populates="user", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email} [{self.role}]>"

    def to_dict(self):
        return {
            "id":         self.id,
            "email":      self.email,
            "full_name":  self.full_name,
            "phone":      self.phone,
            "role":       self.role,
            "is_active":  self.is_active,
            "created_at": self.created_at.isoformat(),
        }
