"""Dermatologist profile – extends User with professional context."""

from app import db


class Dermatologist(db.Model):
    __tablename__ = "dermatologists"

    id               = db.Column(db.Integer, primary_key=True)
    user_id          = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    license_number   = db.Column(db.String(100), unique=True, nullable=False)
    specialization   = db.Column(db.String(150), nullable=True)
    bio              = db.Column(db.Text, nullable=True)
    years_experience = db.Column(db.Integer, nullable=True)
    is_available     = db.Column(db.Boolean, default=True)

    # ── Relationships ──────────────────────────────────────────────────────
    user         = db.relationship("User",        back_populates="dermatologist_profile")
    appointments = db.relationship("Appointment", back_populates="dermatologist")

    def __repr__(self):
        return f"<Dermatologist license={self.license_number}>"

    def to_dict(self):
        return {
            "id":               self.id,
            "user_id":          self.user_id,
            "license_number":   self.license_number,
            "specialization":   self.specialization,
            "bio":              self.bio,
            "years_experience": self.years_experience,
            "is_available":     self.is_available,
            "full_name":        self.user.full_name if self.user else None,
        }
