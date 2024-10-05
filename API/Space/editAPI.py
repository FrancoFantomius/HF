from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename
import os
import config as cfg
import sessionManager.files_handler as files_handler
from models import db, Folder, File, Access

edit = Blueprint("edit", __name__)

## Upload file to space
@edit.route('/upload', methods=['POST'])
@login_required
def SpaceUpload():
    if 'file' in request.files and request.form.get("folderId"):
        file = request.files["file"]
        folder_id = request.form.get("folderId")
        
        # Check if the folder exists and retrieve it
        folder = Folder.query.filter_by(id=folder_id).first()
        if folder:
            # Check if the current user has access to this folder
            has_access = folder.proprietary_id == current_user.id or Access.query.filter_by(
                user_id=current_user.id,
                folder_id=folder_id,
                trashed = False
            ).first()
            
        if not folder or not has_access:
            return jsonify({'error': 'Folder not found'}), 404  # Forbidden
        
        # Check if the file is allowed
        if file:
            # Sanitize the file name and save it to the uploads folder
            file_name = secure_filename(file.filename)

            # Define the file path
            file_path = files_handler.create_path(file_name)
            
            file.save(os.path.join(cfg.UploadFolder, file_path))
            file_size = os.path.getsize(os.path.join(cfg.UploadFolder, file_path))

            # Database integration
            new_file = File(
                name=file_name,
                upload_location=file_path,
                folder_id = folder_id,
                size=file_size,
                proprietary_id=current_user.id,
                type = files_handler.get_type(file_path)
            )

            current_user.used_space += file_size

            db.session.add(new_file)
            db.session.commit()
            
            return jsonify({'message': 'File successfully uploaded'}), 200
    return jsonify({'error': 'File not uploaded'}), 400


## Create a new folder
@edit.route('/new-folder', methods=["POST"])
@login_required
def newFolder():
    data = request.get_json()
    if 'folder_id' in data:
        folder = Folder.query.filter_by(id=data["folder_id"]).first()
        if folder:
            has_access = folder.proprietary_id == current_user.id or Access.query.filter_by(
                user_id=current_user.id,
                folder_id=folder.id,
                trashed = False
            ).first()
            if has_access:
                new_folder = Folder(
                    name = data['name'],
                    parent_folder_id = folder.id,
                    proprietary_id = folder.proprietary_id
                )
                db.session.add(new_folder)
                db.session.commit()
                return jsonify({'message': 'Folder created', 'Id': new_folder.id}), 200
    return jsonify({'error': 'Folder not found or permission not given'}), 400

## Rename a file/folder
@edit.route("/rename", methods = ['POST'])
@login_required
def rename():
    data = request.get_json()

    # Rename folder
    if 'name' in data and 'folder_id' in data:
        folder = Folder.query.filter_by(id = data['folder_id']).first()
        if folder and folder.proprietary_id == current_user.id:
            folder.name = data["name"]
            db.session.commit()
            return jsonify({"message":"Folder renamed"}), 200
    
    # Rename file
    if 'name' in data and 'file_id' in data:
        file = File.query.filter_by(id = data['file_id']).first()
        if file and file.proprietary_id == current_user.id:
            file.name = data["name"]
            print(file)
            db.session.commit()
            return jsonify({"message":"File renamed"}), 200
    return jsonify({'error': 'File not found or user is not proprietary'}), 400


@edit.route("/move", methods = ['POST'])
@login_required
def move():
    data = request.get_json()
    # If it's folder
    if 'new_position' in data and 'folder_id' in data:
        folder = Folder.query.filter_by(id = data['folder_id']).first()
        position = Folder.query.filter_by(id = data['new_position']).first()
        if folder and position and folder.proprietary_id == current_user.id == position.proprietary_id:
            folder.parent_folder_id = position.id
            db.session.commit()
            return jsonify({"message":'Folder moved'}), 200
    
    # If it's a file
    if 'new_position' in data and 'file_id' in data:
        file = File.query.filter_by(id = data['file_id']).first()
        position = Folder.query.filter_by(id = data['new_position']).first()
        if file and position and file.proprietary_id == current_user.id == position.proprietary_id:
            file.folder_id = position.id
            db.session.commit()
            return jsonify({'message': 'File moved'}), 200
    
    return jsonify({"error": "File not found or user is not proprietary"}), 400
