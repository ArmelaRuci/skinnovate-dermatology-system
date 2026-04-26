"""
Skinnovate Flask Application Factory
-------------------------------------
Centralizes all extension initialization and blueprint registration.
Follows the Application Factory pattern for testability and scalability.
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt

# ── Extension singletons (initialized without app) ──────────────────────────
db       = SQLAlchemy()
migrate  = Migrate()
jwt      = JWTManager()
bcrypt   = Bcrypt()


def create_app(config_name: str = "development") -> Flask:
    """Create and configure the Flask application.

    Args:
        config_name: One of 'development', 'testing', 'production'.

    Returns:
        Configured Flask application instance.
    """
    app = Flask(__name__, instance_relative_config=True)

    # ── Load configuration ────────────────────────────────────────────────
    from app.config import config_map
    app.config.from_object(config_map[config_name])

    # ── Initialize extensions ─────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}},
        supports_credentials=True,
    )

    # ── Register blueprints ───────────────────────────────────────────────
    from app.api.routes.auth        import auth_bp
    from app.api.routes.users       import users_bp
    from app.api.routes.appointments import appointments_bp
    from app.api.routes.analysis    import analysis_bp
    from app.api.routes.records     import records_bp
    from app.api.routes.treatments  import treatments_bp
    from app.api.routes.admin       import admin_bp

    app.register_blueprint(auth_bp,         url_prefix="/api/auth")
    app.register_blueprint(users_bp,        url_prefix="/api/users")
    app.register_blueprint(appointments_bp, url_prefix="/api/appointments")
    app.register_blueprint(analysis_bp,     url_prefix="/api/analysis")
    app.register_blueprint(records_bp,      url_prefix="/api/records")
    app.register_blueprint(treatments_bp,   url_prefix="/api/treatments")
    app.register_blueprint(admin_bp,        url_prefix="/api/admin")

    # ── JWT error handlers ────────────────────────────────────────────────
    from app.middleware.jwt_handlers import register_jwt_handlers
    register_jwt_handlers(jwt)

    # ── Health check ──────────────────────────────────────────────────────
    @app.get("/api/health")
    def health():
        return {"status": "ok", "version": "1.0.0"}

    # ── Ensure upload dir exists ──────────────────────────────────────────
    import os
    os.makedirs(app.config.get("UPLOAD_FOLDER", "uploads"), exist_ok=True)

    return app
