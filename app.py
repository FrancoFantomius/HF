# Dependencies
from flask import Flask, render_template, redirect, url_for
from flask_login import LoginManager
from flask_apscheduler import APScheduler
from flask_cors import CORS

# For the configuration variables see ./config.py
import config as cfg

# Database
from models import db, User

# Blueprints
from auth import auth
from API.api import api
from space import space
from ideas import ideas

# Schedule
import schedule

# Initialize Flask App
app = Flask(__name__)
app.config['SECRET_KEY'] = cfg.SecretKey
app.config['SQLALCHEMY_DATABASE_URI'] = cfg.DatabaseURI
db.init_app(app)
app.config['UPLOAD_FOLDER'] = cfg.UploadFolder
app.config['MAX_CONTENT_LENGTH'] = cfg.MaxFileSize

CORS(app, resources={r"/api/*": {"origins": "*"}})


# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'  # Where to redirect if not logged in

@login_manager.user_loader
def load_user(user_id):
    return User.query.filter_by(id = str(user_id)).first()

# Blueprints registration
app.register_blueprint(auth, url_prefix = '/account')
app.register_blueprint(api, url_prefix = '/api')
app.register_blueprint(space, url_prefix = '/space')
app.register_blueprint(ideas, url_prefix = '/ideas')


@app.errorhandler(404)
def page_error(e):
    return render_template("FileNotFound.html"), 404

@app.route("/")
def index():
    return redirect(url_for('auth.index'))

# Initialize the Scheduler
scheduler = APScheduler()

app.config['SCHEDULER_API_ENABLED'] = True
scheduler.init_app(app)
scheduler.start()

# Schedule the function to run every day
@scheduler.task('interval', id='check_old_entries', days=1)
def daily_schedule():
    schedule.empty_trashcan()




if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure tables are created

    app.run(debug=True)
