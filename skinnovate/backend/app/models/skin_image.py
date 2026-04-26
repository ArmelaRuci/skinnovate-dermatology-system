"""Skin image model – stores uploaded images and links to AI diagnoses."""

from datetime import datetime, timezone
from app import db


class SkinImage(db.Model):
    __tablename__ = "skin_images"

    id          = db.Column(db.Integer, primary_key=True)
    patient_id  = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    filename    = db.Column(db.String(255), nullable=False)
    filepath    = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text, nullable=True)
    body_area   = db.Column(db.String(100), nullable=True)   # e.g. "left cheek", "back"
    uploaded_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # ── Relationships ──────────────────────────────────────────────────────
    patient    = db.relationship("Patient",     back_populates="skin_images")
    diagnosis  = db.relationship("AIDiagnosis", back_populates="skin_image", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id":          self.id,
            "patient_id":  self.patient_id,
            "filename":    self.filename,
            "filepath":    self.filepath,
            "description": self.description,
            "body_area":   self.body_area,
            "uploaded_at": self.uploaded_at.isoformat(),
        }
