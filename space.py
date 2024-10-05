from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify, abort, send_file, abort
from flask_login import login_required, current_user
from models import db, File, Folder, Access, Trashcan, SharedLinks
import config as cfg
import os
import sessionManager.files_handler as files_handler

space = Blueprint('space', __name__)

# Route for the home page
@space.route('/')
@login_required
def index():
    folder = Folder.query.filter_by(proprietary_id=current_user.id, parent_folder_id=None).first()
    if folder:
        return redirect(url_for('space.FolderView', folder_id=folder.id))
    else:
        new_folder = Folder(
            name = 'Home',
            proprietary_id = current_user.id
        )

        db.session.add(new_folder)
        db.session.commit()
        
        return redirect(url_for('space.FolderView', folder_id=new_folder.id))

# Visualize a given folder
@space.route('/folder/<folder_id>')
@login_required
def FolderView(folder_id):
    # Check if the folder exists and retrieve it
    folder = Folder.query.filter_by(id=folder_id, trashed = False).first()
    
    if folder:
        # Check if the current user has access to this folder
        has_access = folder.proprietary_id == current_user.id or Access.query.filter_by(
            user_id=current_user.id,
            folder_id=folder_id,
            trashed = False
        ).first()
        
        if has_access:
            return render_template("Space/Interface.html", folder=folder)
                
    abort(404)

# Download a given file
@space.route('/file/<file_id>')
@login_required
def FileView(file_id):
    # Check if the folder exists and retrieve it
    file = File.query.filter_by(id=file_id).first()
    if file:
        # Check if the current user has access to this folder
        has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
            user_id=current_user.id,
            file_id=file_id,
            trashed=False
        ).first()

        return send_file(os.path.join(cfg.UploadFolder, file.upload_location), as_attachment=True, download_name=file.name)
    
    abort(404)

# Visualize the trashcan
@space.route('/trash')
@login_required
def TrashcanView():
    trashcan_files = Trashcan.query.filter_by(proprietary_id = current_user.id, is_folder = False).all()
    trashcan_folders = Trashcan.query.filter_by(proprietary_id = current_user.id, is_folder = True).all()
    
    return render_template('Space/TrashInterface.html', files=trashcan_files, subfolders=trashcan_folders)

# Visualize the Shared files
@space.route('/shared')
@login_required
def SharedView():

    return render_template('Space/ShareInterface.html')

# Redirects to the folder/file and gives access
@space.route('/share/<sharelink>')
@login_required
def ShareLink(sharelink):
    share = SharedLinks.query.filter_by(id = sharelink).first()
    if share:
        
        # Is a Folder
        if share.is_folder:
            folder = Folder.query.filter_by(id = share.true_id, trashed = False).first()
            if folder:
                has_access = folder.proprietary_id == current_user.id or Access.query.filter_by(
                    user_id = current_user.id,
                    folder_id = folder.id,
                    trashed = False
                )
                if has_access:
                    return redirect(url_for('space.FolderView', folder_id = folder.id))
                else:
                    files_handler.share_folder(folder=folder, user_id=current_user.id)
                    return redirect(url_for('space.FolderView', folder_id = folder.id))
        
        # Is a File
        else:
            file = File.query.filter_by(id= share.true_id, trashed = False).first()
            if file:
                has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
                    user_id = current_user.id,
                    file_id = file.id,
                    trashed = False
                )
                if has_access:
                    return redirect(url_for('space.FileView', file_id = file.id))
                else:
                    files_handler.share_file(file=file, user_id=current_user.id)
                    return redirect(url_for('space.FileView', file_id = file.id))
        
    return abort(404)