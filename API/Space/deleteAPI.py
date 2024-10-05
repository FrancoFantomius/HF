from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
import sessionManager.files_handler as files_handler
from models import db, Folder, File, Trashcan

trash = Blueprint("trash", __name__)

## Delete a folder
@trash.route('/delete/folder', methods = ['POST'])
@login_required
def deleteFolder():
    data = request.get_json()
    
    if 'folder_id' in data:
        folder = Folder.query.filter_by(id = data['folder_id']).first()
        if folder and folder.proprietary_id == current_user.id:
            files_handler.trash_folder(folder)
            return jsonify({'message': 'Folder deleted'}), 200
    return jsonify({'error': 'Folder not found or permission not given'}), 400


## Delete a file
@trash.route('/delete/file', methods = ['POST'])
@login_required
def deleteFile():
    data = request.get_json()
    if 'file_id' in data:
        file = File.query.filter_by(id = data['file_id']).first()
        if file and file.proprietary_id == current_user.id:
            files_handler.trash_file(file)
            return jsonify({'message': 'File deleted'}), 200
    return jsonify({'error': 'File not found or permission not given'}), 400


## Restore a file
@trash.route('/restore/file', methods = ["POST"])
@login_required
def restoreFile():
    data = request.get_json()
    if 'file_id' in data:
        
        # Gets the file from the database
        file = File.query.filter_by(id = data['file_id']).first()

        if file.proprietary_id == current_user.id:
            files_handler.restore_file(file)
            return jsonify({'message': 'File restored'}), 200
    return jsonify({"error": "File not found"}), 400

## Restore a folder
@trash.route('/restore/folder', methods = ["POST"])
@login_required
def restoreFolder():
    data = request.get_json()
    if 'folder_id' in data:
        # Gets the folder
        folder = Folder.query.filter_by(id = data['folder_id'])
        
        if folder.proprietary_id == current_user.id:
            files_handler.restore_folder(folder)
            return jsonify({"message": "Folder restored"}), 200
    return jsonify({"error": "File not found"}), 400

## Permanently deletes a trashed file
@trash.route('/delete/permanent/file', methods = ["POST"])
@login_required
def deleteTrashedFile():
    data = request.get_json()
    if 'file_id' in data:
        file = File.query.filter_by(id = data['file_id']).first()
        has_access = file.proprietary_id == current_user.id
        current_user.used_space -= file.size
        db.session.commit()
        if has_access:
            files_handler.remove_file(file)
            return jsonify({'message': 'File deleted'}), 200
    return jsonify({'error': 'File not found or permission not given'}), 400

## Permanently deletes a trashed folder
@trash.route('/delete/permanent/folder', methods = ["POST"])
@login_required
def deleteTrashedFolder():
    data = request.get_json()
    if 'folder_id' in data:
        folder = Folder.query.filter_by(id = data['folder_id'], trashed = True).first()
        has_access = folder and folder.proprietary_id == current_user.id
        if has_access:
            files_handler.remove_folder(folder)
            return jsonify({'message': 'File deleted'}), 200
    return jsonify({'error': 'File not found or permission not given'}), 400

## Empty the trashcan
@trash.route('/delete/permanent/trashcan', methods = ['POST'])
@login_required
def emptyTrash():
    trashcan_files = Trashcan.query.filter_by(proprietary_id = current_user.id, is_folder = False).all()
    trashcan_folders = Trashcan.query.filter_by(proprietary_id = current_user.id, is_folder = True).all()
    
    for trash_file in trashcan_files:
        file = File.query.filter_by(id = trash_file.old_id).first()
        if file:
            files_handler.remove_file(file)
    
    for trash_folder in trashcan_folders:
        folder = Folder.query.filter_by(id = trash_folder.old_id).first()
        if folder:
            files_handler.remove_folder(folder)
    return jsonify({'message': 'Trashcan emptied'})
