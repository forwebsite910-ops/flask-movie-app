from flask import Flask
from .extensions import db, migrate, login_manager, bcrypt
from .config import Config

def create_app(config_object=Config):
    app = Flask(__name__, static_folder="static", template_folder="templates")
    app.config.from_object(config_object)

    # initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    # blueprints
    from .auth import auth_bp
    from .reviews import reviews_bp
    from .api import api_bp
    from .routes import main
    

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(reviews_bp, url_prefix="/reviews")
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(main)

    # simple index (can serve SPA)
    @app.route("/")
    def index():
        return app.send_static_file("index.html") if app.static_folder else ("Hello from Flask backend", 200)

    return app
