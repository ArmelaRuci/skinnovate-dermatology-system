"""Models package – imports all models so SQLAlchemy can discover them."""

from app.models.user         import User
from app.models.patient      import Patient
from app.models.dermatologist import Dermatologist
from app.models.appointment  import Appointment
from app.models.skin_image   import SkinImage
from app.models.ai_diagnosis import AIDiagnosis
from app.models.medical_note import MedicalNote
from app.models.treatment    import Treatment
from app.models.prescription import Prescription

__all__ = [
    "User", "Patient", "Dermatologist", "Appointment",
    "SkinImage", "AIDiagnosis", "MedicalNote", "Treatment", "Prescription",
]
