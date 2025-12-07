from flask import Blueprint, request, jsonify, render_template, redirect, url_for, flash
from .extensions import db
from .models import User
from flask_login import login_user, logout_user, login_required, current_user

auth_bp = Blueprint("auth", __name__, template_folder="templates")

@auth_bp.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        data = request.form or request.get_json() or {}
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        if not username or not email or not password:
            return jsonify({"error":"username, email and password required"}), 400
        if User.query.filter((User.username==username) | (User.email==email)).first():
            return jsonify({"error":"user already exists"}), 400
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        # auto-login after signup (optional)
        login_user(user)
        return jsonify({"message":"user created", "user":{"id":user.id, "username":user.username}}), 201

    # GET -> serve a signup page if you want
    return render_template("signup.html")

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.form or request.get_json() or {}
        username_or_email = data.get("username") or data.get("email")
        password = data.get("password")
        if not username_or_email or not password:
            return jsonify({"error":"credentials required"}), 400
        user = User.query.filter((User.username==username_or_email) | (User.email==username_or_email)).first()
        if user and user.check_password(password):
            login_user(user)
            return jsonify({"message":"logged in", "user":{"id":user.id, "username":user.username}}), 200
        return jsonify({"error":"invalid credentials"}), 401

    return render_template("login.html")

@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message":"logged out"}), 200

@auth_bp.route("/me")
def me():
    if not current_user.is_authenticated:
        return jsonify({"authenticated":False}), 200
    return jsonify({"authenticated":True, "user":{"id":current_user.id, "username":current_user.username, "email":current_user.email}}), 200
