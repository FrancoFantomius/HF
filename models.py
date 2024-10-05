from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
import secrets
import string
from datetime import datetime, timezone


db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(10), primary_key=True, default= lambda: User.generate_unique_id())
    username = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(150), nullable=False)

    # User role
    admin = db.Column(db.Boolean, nullable=False, default=False) # False = normal user, True = admin

    # Spaces
    max_space = db.Column(db.Integer, nullable=False, default=10) # Space dedicated per user in GB put 0 for unlimited space
    used_space = db.Column(db.Integer, nullable=False, default= 0) # Space used
    
    # Relationship to access table (for many-to-many permissions)
    accessed_files = db.relationship('Access', back_populates='user')


    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def generate_unique_id(lenght:int=10):
        """Generates a unique [lenght]-character alphanumeric ID."""
        characters = string.ascii_letters + string.digits
        while True:
            random_id = ''.join(secrets.choice(characters) for _ in range(lenght))
            # Check if the ID already exists in the database
            if not User.query.get(random_id):
                return random_id

# Folder Table
class Folder(db.Model):
    __tablename__ = 'folders'
    id = db.Column(db.String(10), primary_key=True, default= lambda:Folder.generate_unique_id())
    name = db.Column(db.String(255), nullable=False)
    parent_folder_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=True)
    creation_date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    proprietary_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    trashed = db.Column(db.Boolean, default=False, nullable=False)

    
    # Relationship to User (proprietary)
    proprietary = db.relationship('User', backref='folders')
    
    # Self-referential relationship (for folder hierarchy)
    parent_folder = db.relationship('Folder', remote_side=[id], backref='subfolders')
    
    # Relationship to files in the folder
    files = db.relationship('File', backref='folder')


    @staticmethod
    def generate_unique_id(lenght:int=10):
        """Generates a unique [lenght]-character alphanumeric ID."""
        characters = string.ascii_letters + string.digits
        while True:
            random_id = ''.join(secrets.choice(characters) for _ in range(lenght))
            # Check if the ID already exists in the database
            if not Folder.query.get(random_id):
                return random_id

class Trashcan(db.Model):
    __tablename__ = 'trashcan'
    id = db.Column(db.String(10), primary_key=True, default=lambda: Trashcan.generate_unique_id())
    proprietary_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    old_id = db.Column(db.String(10), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    is_folder = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))  # Add a creation timestamp


    # Relationship to User (proprietary)
    proprietary = db.relationship('User', backref='trashcan')


    @staticmethod
    def generate_unique_id(lenght:int=10):
        characters = string.ascii_letters + string.digits
        while True:
            random_id = ''.join(secrets.choice(characters) for _ in range(lenght))
            if not Trashcan.query.get(random_id):
                return random_id


# File Table (with last_modified_date and size fields)
class File(db.Model):
    __tablename__ = 'files'
    id = db.Column(db.String(10), primary_key=True, default=lambda:File.generate_unique_id())
    name = db.Column(db.String(255), nullable=False)
    folder_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=False)
    upload_location = db.Column(db.String(255), nullable=False)
    creation_date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    last_modified_date = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    size = db.Column(db.Integer, nullable=False)  # Size in bytes
    proprietary_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    trashed = db.Column(db.Boolean, default=False, nullable=False)
    type = db.Column(db.String(15), default = "other")
    
    # Relationship to User (proprietary)
    proprietary = db.relationship('User', backref='files')


    @staticmethod
    def generate_unique_id(lenght:int=10):
        """Generates a unique [lenght]-character alphanumeric ID."""
        characters = string.ascii_letters + string.digits
        while True:
            random_id = ''.join(secrets.choice(characters) for _ in range(lenght))
            # Check if the ID already exists in the database
            if not File.query.get(random_id):
                return random_id

# Access Table (for managing file/folder access)
class Access(db.Model):
    __tablename__ = 'access'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    folder_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=True)
    file_id = db.Column(db.Integer, db.ForeignKey('files.id'), nullable=True)
    trashed = db.Column(db.Boolean, default=False, nullable=False)


    # Relationships to users and files/folders
    user = db.relationship('User', back_populates='accessed_files')
    folder = db.relationship('Folder', backref='access_permissions')
    file = db.relationship('File', backref='access_permissions')

class SharedLinks(db.Model):
    __tablename__ = 'sharelinks'
    id = db.Column(db.String(10), primary_key = True, default = lambda:SharedLinks.generate_unique_id())
    is_folder = db.Column(db.Boolean, default=False, nullable = False)
    true_id = db.Column(db.String(10), nullable=False)

    
    @staticmethod
    def generate_unique_id(lenght:int=10):
        """Generates a unique [lenght]-character alphanumeric ID."""
        characters = string.ascii_letters + string.digits
        while True:
            random_id = ''.join(secrets.choice(characters) for _ in range(lenght))
            # Check if the ID already exists in the database
            if not SharedLinks.query.get(random_id):
                return random_id