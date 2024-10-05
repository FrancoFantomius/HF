from flask import Blueprint, render_template, redirect, url_for, request, flash, abort
from flask_login import login_user, logout_user, login_required, current_user
from models import User, db
import config as cfg
import re

auth = Blueprint('auth', __name__)

# Main Account Page
@auth.route("/")
@login_required
def index():
    return render_template('Authentication/index.html')

# Admin Managing page
@auth.route("/admin")
@login_required
def admin():
    for user in User.query.all():
        print(user.username)
        print(user.email)
        print(user.admin)

    if current_user.admin != True:
        return abort(404)
    users = User.query.all()
    return render_template("Authentication/admin.html", users=users)

# Login Route
@auth.route('/signin', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            if user.email in cfg.adminmail:
                user.admin = True
                db.session.commit()
            login_user(user)
            return redirect(url_for('space.index'))
        else:
            flash('Invalid email or password')
    return render_template('Authentication/signin.html')

# Register Route
@auth.route('/signup', methods=['GET', 'POST'])
def register():
    # Check if new user registrations are disabled
    if len(User.query.all()) >= cfg.AcceptNewUsers:
        flash('Registration is currently disabled. Please contact the administrator.')
        return redirect(url_for('auth.login'))  # Redirect to login or another page

    if request.method == 'POST':
        if len(User.query.all()) >= cfg.AcceptNewUsers:
            return redirect(url_for('auth.login'))
        
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        password_confirmation = request.form.get('password_confirmation')

        # Input validation
        if not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            flash('Invalid email address')
            return render_template('Authentication/signup.html')

        if len(password) < 6:
            flash('Password must be at least 6 characters long')
            return render_template('Authentication/signup.html')

        if password != password_confirmation:
            flash('Passwords do not match')
            return render_template('Authentication/signup.html')

        # Check if the email already exists
        if User.query.filter_by(email=email).first():
            flash('Email address already in use')
            return render_template('Authentication/signup.html')

        # Create a new user and set the password hash
        new_user = User(email=email, username=username)
        new_user.set_password(password)  # Hashing the password

        if new_user.email in cfg.adminmail:
            new_user.admin = True

        db.session.add(new_user)
        db.session.commit()

        # Log the user in after registration
        login_user(new_user)
        flash('Registration successful!', 'success')
        return redirect(url_for('space.index'))  # Redirect to a profile or home page

    return render_template('Authentication/signup.html')

# Logout Route
@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))