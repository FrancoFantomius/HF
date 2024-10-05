from flask import Blueprint, render_template, redirect, url_for, abort
from flask_login import current_user, login_required
from models import db, File, Folder
import config as cfg
from sessionManager.files_handler import create_path
import os

ideas = Blueprint('ideas', __name__)

# Home
@ideas.route('/')
@login_required
def index():
    return render_template("ideas/Interface.html")

"""@ideas.route('/drawboard/<file_id>')
@login_required
def drawboard(file_id):
    if file_id == 'new':
        folder = Folder.query.filter_by(proprietary_id=current_user.id, parent_folder_id=None).first()
        if not folder:
            new_folder = Folder(
                name = 'Home',
                proprietary_id = current_user.id
            )

            db.session.add(new_folder)
            db.session.commit()
            folder = new_folder

        id = File.generate_unique_id()
        file_path = create_path('NewNote.note')
        new_note = File(
            id = id,
            name='New Note',
            upload_location=file_path,
            folder_id = folder.id,
            size=0,
            proprietary_id=current_user.id,
            type = 'note'
        )

        db.session.add(new_note)
        db.session.commit()
        
        return redirect(url_for("ideas.drawboard", file_id = id))
    
    file = File.query.filter_by(id = file_id, trashed = False, type = "note").first()
    if not file:
        abort(404)
    
    return render_template('Ideas/drawboard.html', file = file)"""