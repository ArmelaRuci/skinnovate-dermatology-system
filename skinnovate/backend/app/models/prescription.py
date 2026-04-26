"""E-Prescription model."""

from datetime import datetime, timezone
from app import db


class Prescription(db.Model):
    __tablename__ = "prescriptions"

    id               = db.Column(db.Integer, primary_key=True)
    patient_id       = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    dermatologist_id = db.Column(db.Integer, db.ForeignKey("dermatologists.id"), nullable=False)
    appointment_id   = db.Column(db.Integer, db.ForeignKey("appointments.id"), nullable=True)
    medications      = db.Column(db.JSON, nullable=False)   # [{name, dosage, frequency, duration}]
    notes            = db.Column(db.Text, nullable=True)
    issued_at        = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    valid_until      = db.Column(db.DateTime, nullable=True)
    status           = db.Column(
                           db.Enum("active", "filled", "expired", "cancelled", name="prescription_status"),
                           default="active",
                       )

    patient       = db.relationship("Patient",       foreign_keys=[patient_id])
    dermatologist = db.relationship("Dermatologist", foreign_keys=[dermatologist_id])

    def to_dict(self):
        return {
            "id":               self.id,
            "patient_id":       self.patient_id,
            "dermatologist_id": self.dermatologist_id,
            "appointment_id":   self.appointment_id,
            "medications":      self.medications,
            "notes":            self.notes,
            "issued_at":        self.issued_at.isoformat(),
            "valid_until":      self.valid_until.isoformat() if self.valid_until else None,
            "status":           self.status,
        }
