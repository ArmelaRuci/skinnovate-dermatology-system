"""
Configuration classes for different environments.
All sensitive values are read from environment variables via python-dotenv.
"""

import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    """Shared settings across all environments."""
    SECRET_KEY               = os.getenv("SECRET_KEY", "change-me-in-production")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY           = os.getenv("JWT_SECRET_KEY", "jwt-change-me")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600)))
    JWT_REFRESH_TOKEN_EXPIRES= timedelta(seconds=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", 2592000)))
    UPLOAD_FOLDER            = os.getenv("UPLOAD_FOLDER", "uploads")
    MAX_CONTENT_LENGTH       = int(os.getenv("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))  # 16 MB
    AI_MODEL_PATH            = os.getenv("AI_MODEL_PATH", "app/services/ai_service/model/skin_model.h5")
    AI_CONFIDENCE_THRESHOLD  = float(os.getenv("AI_CONFIDENCE_THRESHOLD", 0.70))
    CORS_ORIGINS             = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}


class DevelopmentConfig(BaseConfig):
    DEBUG      = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://skinnovate_user:password@localhost:5432/skinnovate_db"
    )
    SQLALCHEMY_ECHO = False   # set True to log SQL queries


class TestingConfig(BaseConfig):
    TESTING    = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)


class ProductionConfig(BaseConfig):
    DEBUG      = False
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SESSION_COOKIE_SECURE    = True
    SESSION_COOKIE_HTTPONLY  = True


config_map = {
    "development": DevelopmentConfig,
    "testing":     TestingConfig,
    "production":  ProductionConfig,
}
