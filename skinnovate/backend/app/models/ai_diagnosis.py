"""AI Diagnosis model – stores model output for a skin image."""

from datetime import datetime, timezone
from app import db


class AIDiagnosis(db.Model):
    __tablename__ = "ai_diagnoses"

    id                  = db.Column(db.Integer, primary_key=True)
    skin_image_id       = db.Column(db.Integer, db.ForeignKey("skin_images.id"), unique=True, nullable=False)
    predicted_condition = db.Column(db.String(200), nullable=False)
    confidence_score    = db.Column(db.Float,        nullable=False)
    all_predictions     = db.Column(db.JSON,         nullable=True)   # top-k predictions with scores
    severity            = db.Column(db.String(50),   nullable=True)   # low | medium | high
    requires_consultation = db.Column(db.Boolean,    default=False)
    diagnosed_at        = db.Column(db.DateTime,     default=lambda: datetime.now(timezone.utc))

    # Doctor validation fields
    doctor_confirmed    = db.Column(db.Boolean, nullable=True)          # None = pending, True/False = validated
    doctor_diagnosis    = db.Column(db.String(200), nullable=True)
    validated_by        = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    validated_at        = db.Column(db.DateTime, nullable=True)

    # ── Relationships ──────────────────────────────────────────────────────
    skin_image  = db.relationship("SkinImage", back_populates="diagnosis")
    validator   = db.relationship("User",      foreign_keys=[validated_by])

    def to_dict(self):
        return {
            "id":                    self.id,
            "skin_image_id":         self.skin_image_id,
            "predicted_condition":   self.predicted_condition,
            "confidence_score":      round(self.confidence_score, 4),
            "all_predictions":       self.all_predictions,
            "severity":              self.severity,
            "requires_consultation": self.requires_consultation,
            "diagnosed_at":          self.diagnosed_at.isoformat(),
            "doctor_confirmed":      self.doctor_confirmed,
            "doctor_diagnosis":      self.doctor_diagnosis,
            "validated_by":          self.validated_by,
            "validated_at":          self.validated_at.isoformat() if self.validated_at else None,
        }
