"""Patient profile – extends User with medical context."""

from datetime import datetime, timezone
from app import db


class Patient(db.Model):
    __tablename__ = "patients"

    id              = db.Column(db.Integer, primary_key=True)
    user_id         = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    date_of_birth   = db.Column(db.Date,    nullable=True)
    gender          = db.Column(db.String(20), nullable=True)
    skin_type       = db.Column(db.String(50), nullable=True)   # oily, dry, combination, sensitive, normal
    allergies       = db.Column(db.Text,    nullable=True)
    medical_history = db.Column(db.Text,    nullable=True)
    loyalty_points  = db.Column(db.Integer, default=0)

    # ── Relationships ──────────────────────────────────────────────────────
    user         = db.relationship("User",        back_populates="patient_profile")
    appointments = db.relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")
    skin_images  = db.relationship("SkinImage",   back_populates="patient", cascade="all, delete-orphan")
    treatments   = db.relationship("Treatment",   back_populates="patient", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Patient user_id={self.user_id}>"

    def to_dict(self):
        return {
            "id":               self.id,
            "user_id":          self.user_id,
            "date_of_birth":    self.date_of_birth.isoformat() if self.date_of_birth else None,
            "gender":           self.gender,
            "skin_type":        self.skin_type,
            "allergies":        self.allergies,
            "medical_history":  self.medical_history,
            "loyalty_points":   self.loyalty_points,
        }
