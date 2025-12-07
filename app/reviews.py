from flask import Blueprint, request, jsonify, render_template, abort
from .extensions import db
from .models import Review
from flask_login import login_required, current_user

reviews_bp = Blueprint("reviews", __name__, template_folder="templates")

# Server-side pages (optional)
@reviews_bp.route("/", methods=["GET"])
def list_reviews_page():
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return render_template("index.html", reviews=reviews)

# JSON endpoints for CRUD (frontend should call /api/reviews)
# kept here for completeness if you want server-side too
