"""Treatment plans and progress tracking timeline."""

from datetime import datetime, timezone
from app import db


class Treatment(db.Model):
    __tablename__ = "treatments"

    id               = db.Column(db.Integer, primary_key=True)
    patient_id       = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    dermatologist_id = db.Column(db.Integer, db.ForeignKey("dermatologists.id"), nullable=False)
    diagnosis_id     = db.Column(db.Integer, db.ForeignKey("ai_diagnoses.id"), nullable=True)
    title            = db.Column(db.String(200), nullable=False)
    description      = db.Column(db.Text, nullable=True)
    treatment_type   = db.Column(db.String(100), nullable=True)   # topical, laser, surgical, cosmetic
    status           = db.Column(
                           db.Enum("active", "completed", "paused", "cancelled", name="treatment_status"),
                           default="active",
                       )
    start_date       = db.Column(db.Date, nullable=False)
    end_date         = db.Column(db.Date, nullable=True)
    created_at       = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    patient       = db.relationship("Patient",       back_populates="treatments")
    dermatologist = db.relationship("Dermatologist", foreign_keys=[dermatologist_id])
    progress_logs = db.relationship("TreatmentProgress", back_populates="treatment", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":               self.id,
            "patient_id":       self.patient_id,
            "dermatologist_id": self.dermatologist_id,
            "diagnosis_id":     self.diagnosis_id,
            "title":            self.title,
            "description":      self.description,
            "treatment_type":   self.treatment_type,
            "status":           self.status,
            "start_date":       self.start_date.isoformat(),
            "end_date":         self.end_date.isoformat() if self.end_date else None,
            "created_at":       self.created_at.isoformat(),
        }


class TreatmentProgress(db.Model):
    """Timeline entry – photo + note for a treatment session."""
    __tablename__ = "treatment_progress"

    id           = db.Column(db.Integer, primary_key=True)
    treatment_id = db.Column(db.Integer, db.ForeignKey("treatments.id"), nullable=False)
    image_id     = db.Column(db.Integer, db.ForeignKey("skin_images.id"), nullable=True)
    notes        = db.Column(db.Text, nullable=True)
    logged_by    = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    logged_at    = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    treatment = db.relationship("Treatment", back_populates="progress_logs")
    image     = db.relationship("SkinImage", foreign_keys=[image_id])
    logger    = db.relationship("User",      foreign_keys=[logged_by])

    def to_dict(self):
        return {
            "id":           self.id,
            "treatment_id": self.treatment_id,
            "image_id":     self.image_id,
            "notes":        self.notes,
            "logged_by":    self.logged_by,
            "logged_at":    self.logged_at.isoformat(),
        }
