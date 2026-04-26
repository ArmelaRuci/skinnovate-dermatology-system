"""Flask-Migrate entry point.
Run:  flask db init  →  flask db migrate  →  flask db upgrade
"""
from app import create_app, db
from flask_migrate import Migrate

app     = create_app()
migrate = Migrate(app, db)
