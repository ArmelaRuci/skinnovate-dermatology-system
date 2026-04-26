"""Medical notes written by dermatologists during/after consultations."""

from datetime import datetime, timezone
from app import db


class MedicalNote(db.Model):
    __tablename__ = "medical_notes"

    id               = db.Column(db.Integer, primary_key=True)
    appointment_id   = db.Column(db.Integer, db.ForeignKey("appointments.id"), nullable=False)
    dermatologist_id = db.Column(db.Integer, db.ForeignKey("dermatologists.id"), nullable=False)
    patient_id       = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    diagnosis_id     = db.Column(db.Integer, db.ForeignKey("ai_diagnoses.id"), nullable=True)
    note_text        = db.Column(db.Text, nullable=False)
    note_date        = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    follow_up_date   = db.Column(db.DateTime, nullable=True)

    # Relationships
    appointment   = db.relationship("Appointment",   back_populates="medical_notes")
    dermatologist = db.relationship("Dermatologist", foreign_keys=[dermatologist_id])
    patient       = db.relationship("Patient",       foreign_keys=[patient_id])
    diagnosis     = db.relationship("AIDiagnosis",   foreign_keys=[diagnosis_id])

    def to_dict(self):
        return {
            "id":               self.id,
            "appointment_id":   self.appointment_id,
            "dermatologist_id": self.dermatologist_id,
            "patient_id":       self.patient_id,
            "diagnosis_id":     self.diagnosis_id,
            "note_text":        self.note_text,
            "note_date":        self.note_date.isoformat(),
            "follow_up_date":   self.follow_up_date.isoformat() if self.follow_up_date else None,
        }
