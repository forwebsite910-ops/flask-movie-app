from flask import Blueprint, request, jsonify
from .extensions import db
from .models import Review, User
from flask_login import current_user, login_required

api_bp = Blueprint("api", __name__)

# --- Reviews CRUD (JSON) ---
@api_bp.route("/reviews", methods=["GET"])
def get_reviews():
    # query params: item_id optional
    item_id = request.args.get("item_id")
    q = Review.query
    if item_id:
        q = q.filter_by(item_id=item_id)
    reviews = q.order_by(Review.created_at.desc()).all()
    return jsonify([{
        "id": r.id,
        "title": r.title,
        "body": r.body,
        "rating": r.rating,
        "item_id": r.item_id,
        "user_id": r.user_id,
        "username": r.user.username if r.user else None,
        "created_at": r.created_at.isoformat()
    } for r in reviews])

@api_bp.route("/reviews/<int:review_id>", methods=["GET"])
def get_review(review_id):
    r = Review.query.get_or_404(review_id)
    return jsonify({
        "id": r.id, "title": r.title, "body": r.body, "rating": r.rating,
        "item_id": r.item_id, "user_id": r.user_id, "created_at": r.created_at.isoformat()
    })

@api_bp.route("/reviews", methods=["POST"])
@login_required
def create_review():
    data = request.get_json() or {}
    title = data.get("title")
    rating = data.get("rating", 0)
    body = data.get("body", "")
    item_id = data.get("item_id")
    if not title:
        return jsonify({"error":"title required"}), 400
    review = Review(title=title, rating=int(rating), body=body, item_id=item_id, user_id=current_user.id)
    db.session.add(review)
    db.session.commit()
    return jsonify({"message":"created", "id": review.id}), 201

@api_bp.route("/reviews/<int:review_id>", methods=["PUT", "PATCH"])
@login_required
def update_review(review_id):
    r = Review.query.get_or_404(review_id)
    if r.user_id != current_user.id:
        return jsonify({"error":"forbidden"}), 403
    data = request.get_json() or {}
    r.title = data.get("title", r.title)
    r.body = data.get("body", r.body)
    if "rating" in data:
        r.rating = int(data["rating"])
    db.session.commit()
    return jsonify({"message":"updated"})

@api_bp.route("/reviews/<int:review_id>", methods=["DELETE"])
@login_required
def delete_review(review_id):
    r = Review.query.get_or_404(review_id)
    if r.user_id != current_user.id:
        return jsonify({"error":"forbidden"}), 403
    db.session.delete(r)
    db.session.commit()
    return jsonify({"message":"deleted"})
