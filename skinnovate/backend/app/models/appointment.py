"""Appointment model – tracks the full lifecycle of a clinic visit."""

from datetime import datetime, timezone
from app import db


class Appointment(db.Model):
    __tablename__ = "appointments"

    id                = db.Column(db.Integer, primary_key=True)
    patient_id        = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    dermatologist_id  = db.Column(db.Integer, db.ForeignKey("dermatologists.id"), nullable=True)
    scheduled_at      = db.Column(db.DateTime, nullable=False)
    appointment_type  = db.Column(
                            db.Enum("in_person", "video", "emergency", name="appointment_type"),
                            default="in_person",
                        )
    status            = db.Column(
                            db.Enum(
                                "requested", "scheduled", "in_progress",
                                "completed", "cancelled", "no_show",
                                name="appointment_status",
                            ),
                            default="requested",
                        )
    reason            = db.Column(db.Text, nullable=True)
    notes             = db.Column(db.Text, nullable=True)
    is_emergency      = db.Column(db.Boolean, default=False)
    created_at        = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at        = db.Column(
                            db.DateTime,
                            default=lambda: datetime.now(timezone.utc),
                            onupdate=lambda: datetime.now(timezone.utc),
                        )

    # ── Relationships ──────────────────────────────────────────────────────
    patient       = db.relationship("Patient",       back_populates="appointments")
    dermatologist = db.relationship("Dermatologist", back_populates="appointments")
    medical_notes = db.relationship("MedicalNote",   back_populates="appointment", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":                self.id,
            "patient_id":        self.patient_id,
            "dermatologist_id":  self.dermatologist_id,
            "scheduled_at":      self.scheduled_at.isoformat(),
            "appointment_type":  self.appointment_type,
            "status":            self.status,
            "reason":            self.reason,
            "notes":             self.notes,
            "is_emergency":      self.is_emergency,
            "created_at":        self.created_at.isoformat(),
        }
