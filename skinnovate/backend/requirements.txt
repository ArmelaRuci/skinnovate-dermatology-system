"""Seed the database with demo data for development."""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app, db, bcrypt
from app.models.user import User
from app.models.patient import Patient
from app.models.dermatologist import Dermatologist

app = create_app("development")

DEMO_USERS = [
    {
        "email": "admin@skinnovate.com",
        "password": "Admin1234!",
        "full_name": "System Admin",
        "role": "admin",
    },
    {
        "email": "doctor@skinnovate.com",
        "password": "Doctor1234!",
        "full_name": "Dr. Elena Vasquez",
        "role": "dermatologist",
        "license_number": "DERM-2024-001",
        "specialization": "Medical & Cosmetic Dermatology",
        "bio": "Board-certified dermatologist with 12 years of experience.",
        "years_experience": 12,
    },
    {
        "email": "patient@skinnovate.com",
        "password": "Patient1234!",
        "full_name": "Sara Mitchell",
        "role": "patient",
        "skin_type": "combination",
        "date_of_birth": "1995-06-15",
        "gender": "female",
    },
]


def seed():
    with app.app_context():
        db.create_all()

        for data in DEMO_USERS:
            if User.query.filter_by(email=data["email"]).first():
                print(f"  → {data['email']} already exists, skipping")
                continue

            pw_hash = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
            user = User(
                email=data["email"],
                password_hash=pw_hash,
                full_name=data["full_name"],
                role=data["role"],
            )
            db.session.add(user)
            db.session.flush()

            if data["role"] == "patient":
                from datetime import date
                p = Patient(
                    user_id=user.id,
                    skin_type=data.get("skin_type"),
                    gender=data.get("gender"),
                    date_of_birth=date.fromisoformat(data["date_of_birth"]) if data.get("date_of_birth") else None,
                )
                db.session.add(p)

            elif data["role"] == "dermatologist":
                d = Dermatologist(
                    user_id=user.id,
                    license_number=data["license_number"],
                    specialization=data.get("specialization"),
                    bio=data.get("bio"),
                    years_experience=data.get("years_experience"),
                )
                db.session.add(d)

            db.session.commit()
            print(f"  ✓ Created {data['role']}: {data['email']} / {data['password']}")

        print("\nSeed complete.")


if __name__ == "__main__":
    seed()
