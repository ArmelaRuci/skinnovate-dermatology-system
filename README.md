# Skinnovate — AI-Powered Dermatology Platform

A full-stack web application for a dermatology clinic featuring AI skin analysis, doctor validation, appointment management, and electronic health records.

---

## Tech Stack

| Layer     | Technology                                   |
|-----------|----------------------------------------------|
| Frontend  | React 18, React Router 6, Vite, CSS Modules  |
| Backend   | Flask 3, Flask-JWT-Extended, Flask-SQLAlchemy|
| Database  | PostgreSQL 16                                |
| AI        | TensorFlow / Keras (with mock fallback)      |
| Auth      | JWT (access + refresh tokens), bcrypt        |

---

## Project Structure

```
skinnovate/
├── backend/
│   ├── app/
│   │   ├── __init__.py              # App factory
│   │   ├── config.py                # Dev / Test / Prod configs
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py          # POST /api/auth/register|login|refresh|me
│   │   │       ├── users.py         # PATCH /api/users/profile
│   │   │       ├── analysis.py      # POST /api/analysis/upload  GET /history
│   │   │       ├── appointments.py  # Full CRUD + emergency + availability
│   │   │       ├── records.py       # EHR, notes, prescriptions
│   │   │       ├── treatments.py    # Treatment plans + progress timeline
│   │   │       └── admin.py         # Stats, user management
│   │   ├── models/
│   │   │   ├── user.py              # Base user (all roles)
│   │   │   ├── patient.py           # Patient profile + loyalty
│   │   │   ├── dermatologist.py     # Doctor profile
│   │   │   ├── appointment.py       # Full lifecycle state machine
│   │   │   ├── skin_image.py        # Uploaded images
│   │   │   ├── ai_diagnosis.py      # AI results + doctor validation
│   │   │   ├── medical_note.py      # Consultation notes
│   │   │   ├── treatment.py         # Treatment plans + progress logs
│   │   │   └── prescription.py      # E-prescriptions
│   │   ├── services/
│   │   │   ├── auth_service.py      # JWT + bcrypt logic
│   │   │   └── ai_service/
│   │   │       ├── preprocessor.py  # Image pipeline (resize/normalise)
│   │   │       └── predictor.py     # Model inference + mock fallback
│   │   ├── middleware/
│   │   │   └── jwt_handlers.py      # JWT error handlers + RBAC decorators
│   │   └── utils/
│   │       ├── file_utils.py        # Secure file upload helpers
│   │       └── response.py          # Standardised JSON responses
│   ├── run.py                       # Entry point
│   ├── seed.py                      # Demo data seeder
│   ├── manage.py                    # Flask-Migrate entry
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── App.jsx                  # Router + protected routes
│       ├── main.jsx                 # ReactDOM entry
│       ├── context/
│       │   └── AuthContext.jsx      # JWT + role state
│       ├── services/
│       │   └── api.js               # Axios client + domain helpers
│       ├── styles/
│       │   └── globals.css          # Design tokens + base styles
│       ├── components/
│       │   └── common/
│       │       ├── Navbar.jsx       # Role-aware navigation
│       │       ├── DashboardLayout.jsx
│       │       ├── UI.jsx           # Card, Button, StatCard, FormField…
│       │       └── Spinner.jsx
│       └── pages/
│           ├── public/              # Landing, Login, Register
│           ├── patient/             # Dashboard, AI Analysis, Appointments,
│           │                        # Records, Treatments
│           ├── doctor/              # Dashboard, Queue, Validation, Schedule
│           └── admin/               # Dashboard, User Management
│
├── docker-compose.yml
└── README.md
```

---

## Quick Start (Docker — recommended)

```bash
# 1. Clone / unzip the project
cd skinnovate

# 2. Start all services
docker-compose up --build

# Services:
#   Frontend  →  http://localhost:3000
#   Backend   →  http://localhost:5000
#   DB        →  localhost:5432
```

---

## Quick Start (Manual)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, SECRET_KEY, JWT_SECRET_KEY

# Create database (PostgreSQL must be running)
flask db init
flask db migrate -m "initial"
flask db upgrade

# Seed demo users
python seed.py

# Run dev server
python run.py
# → http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## Demo Accounts

| Role          | Email                        | Password       |
|---------------|------------------------------|----------------|
| Patient       | patient@skinnovate.com       | Patient1234!   |
| Dermatologist | doctor@skinnovate.com        | Doctor1234!    |
| Admin         | admin@skinnovate.com         | Admin1234!     |

---

## API Endpoints

### Auth
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | /api/auth/register   | Register new user        |
| POST   | /api/auth/login      | Login → JWT tokens       |
| POST   | /api/auth/refresh    | Refresh access token     |
| GET    | /api/auth/me         | Current user + profile   |

### AI Analysis
| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| POST   | /api/analysis/upload            | Upload image + run AI inference|
| GET    | /api/analysis/history           | Patient's analysis history     |
| GET    | /api/analysis/:id               | Single diagnosis               |
| PATCH  | /api/analysis/:id/validate      | Doctor confirms/modifies       |

### Appointments
| Method | Endpoint                           | Description              |
|--------|------------------------------------|--------------------------|
| POST   | /api/appointments/                 | Book appointment         |
| GET    | /api/appointments/                 | List (role-filtered)     |
| PATCH  | /api/appointments/:id              | Update / cancel          |
| GET    | /api/appointments/doctors/available| Available doctors        |

### Records
| Method | Endpoint                      | Description             |
|--------|-------------------------------|-------------------------|
| GET    | /api/records/my               | Patient's own records   |
| GET    | /api/records/patient/:id      | Full EHR (doctor/admin) |
| POST   | /api/records/notes            | Add medical note        |
| POST   | /api/records/prescriptions    | Issue prescription      |

### Treatments
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | /api/treatments/                  | Create treatment plan    |
| GET    | /api/treatments/my                | Patient's treatments     |
| PATCH  | /api/treatments/:id               | Update treatment         |
| POST   | /api/treatments/:id/progress      | Log progress entry       |

### Admin
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/admin/stats                | Platform statistics      |
| GET    | /api/admin/users                | All users (filterable)   |
| PATCH  | /api/admin/users/:id/toggle     | Activate / deactivate    |
| GET    | /api/admin/appointments/pending | Pending appointments     |

---

## AI Integration

The AI service converts a Jupyter notebook model into a production callable:

```
Image Upload (multipart/form-data)
    ↓
preprocessor.py
  - Open & convert to RGB
  - EXIF auto-rotation
  - Resize to 224×224 (Lanczos)
  - Normalise [0,1] → ImageNet mean/std
  - Add batch dim → (1, 224, 224, 3)
    ↓
predictor.py
  - Load model once (singleton via _load_model)
  - model.predict(array)
  - Extract top-k predictions
  - Apply severity map
  - Flag requires_consultation if confidence < 0.70 OR severity == "high"
    ↓
AIDiagnosis saved to DB
    ↓
Doctor Validation (PATCH /api/analysis/:id/validate)
```

**To plug in your real model:**
1. Copy your `.h5` file to `backend/app/services/ai_service/model/skin_model.h5`
2. Set `AI_MODEL_PATH` in `.env`
3. Adjust `CONDITION_LABELS` in `predictor.py` to match your training labels

When no model file exists, a deterministic mock predictor is used automatically (safe for development).

---

## Key Design Decisions

- **App Factory pattern** — `create_app()` enables isolated testing and multiple environments
- **One blueprint per domain** — auth, analysis, appointments, records, treatments, admin
- **Role-based access** via `@role_required` decorator — no logic leaks between roles
- **Standardised responses** — every endpoint returns `{ success, message, data }` or `{ error }`
- **AI singleton** — model loaded once at startup, not per-request
- **Mock AI fallback** — deterministic mock when model file absent; zero config for dev
- **CSS Modules** — every component has a colocated `.module.css`; zero global conflicts
- **AuthContext + axios interceptor** — transparent token refresh on 401
