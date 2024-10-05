from flask import Blueprint, jsonify, request, abort
from flask_login import current_user, login_required
from models import db, User, File, Folder, Access
import sessionManager.files_handler as files_handler
import os
import config as cfg

information = Blueprint("info", __name__)

## Find home folder of a user
@information.route('/home', methods=['POST'])
@login_required
def find_home():
    folder = Folder.query.filter_by(proprietary_id=current_user.id, parent_folder_id=None).first()
    if folder:
        return jsonify({'id': folder.id})
    else:
        new_folder = Folder(
            name = 'Home',
            proprietary_id = current_user.id
        )

        db.session.add(new_folder)
        db.session.commit()

        return jsonify({'id': new_folder.id})

## Info for a file
@information.route('/file', methods=['POST'])
@login_required
def infoFile():
    data = request.get_json()
    if 'file_id' in data:
        file = File.query.filter_by(id = data['file_id']).first()
        has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
            user_id = current_user.id,
            file_id = data['file_id']
        ).first()
        if has_access:
            size = str(file.size / 1000) + " KB"
            email = User.query.filter_by(id=file.proprietary_id).first().email
            return jsonify({
                'id' : file.id,
                'name' : file.name,
                'type' : file.type,
                'size' : size,
                'proprietary' : email,
            }), 200
    return jsonify({'error': 'File not found or permission not given'}), 400

## Info for a folder
@information.route('/folder', methods=['POST'])
@login_required
def infoFolder():
    data = request.get_json()
    if 'folder_id' in data:
        folder = Folder.query.filter_by(id = data['folder_id']).first()
        has_access = folder.proprietary_id == current_user.id or Access.query.filter_by(
            user_id = current_user.id,
            folder_id = data['folder_id']
        ).first()
        if has_access:
            user = User.query.filter_by(id=folder.proprietary_id).first()
            print(folder.parent_folder_id)
            return jsonify({
                'id' : folder.id,
                'name' : folder.name,
                'proprietary' : user.email,
                'parent_folder' : folder.parent_folder_id
            }), 200
    return jsonify({'error': 'Folder not found or permission not given'}), 400

## All the content in a folder
@information.route('/viewcontent', methods = ['POST'])
@login_required
def viewContentFolder():
    data = request.get_json()
    if 'folder_id' in data:
        folder = Folder.query.filter_by(id = data['folder_id'], trashed = False).first()
        if folder:
            has_access = folder.proprietary_id == current_user.id or Access.query.filter_by(
                folder_id=folder.id,
                user_id = current_user.id,
                trashed=False
            ).first()
            if has_access:
                files = File.query.filter_by(folder_id=folder.id, trashed = False).all()
                subfolders = Folder.query.filter_by(parent_folder_id=folder.id, trashed = False).all()

                response = {}
                for subfolder in subfolders:
                    response[subfolder.id] = {
                        'type' : 'folder',
                        'id' : subfolder.id,
                        'name' : subfolder.name
                    } 
                for file in files:
                    response[file.id] = {
                        'type' : 'file/' + file.type,
                        'id' : file.id,
                        'name' : file.name
                        }
                return jsonify(response), 200
    return jsonify({'error':'Folder not Found'}), 400


## All the files and folder shared with a user
@information.route('/viewcontent-shared', methods = ['POST'])
@login_required
def viewContentShareFolder():
    files = Access.query.filter_by(user_id = current_user.id, trashed = False, folder_id = None).all()
    subfolders = Access.query.filter_by(user_id = current_user.id, trashed = False, file_id = None).all()

    response = {}

    for subfolder in subfolders:
        response[subfolder.id] = {
            'type' : 'folder',
            'id' : subfolder.id,
            'name' : subfolder.name
        } 

    for file in files:

        file = File.query.filter_by(id = file.file_id, trashed = False).first()

        response[file.id] = {
            'type' : 'file/' + file.type,
            'id' : file.id,
            'name' : file.name
            }

    return jsonify(response), 200

@information.route("/pdf/info/", methods=["POST"])
@login_required
def pdfInfo():
    data = request.get_json()
    if 'file_id' not in data:
        abort(400)
    file = File.query.filter_by(id=data['file_id']).first()
    if not file:
        abort(404)

    has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
        user_id=current_user.id,
        file_id=file.id,
        trashed=False
        ).first()

    if not has_access:
        abort(404)
    
    pdf_path = os.path.join(cfg.UploadFolder, file.upload_location)
    pages = files_handler.get_pdf_page_count(pdf_path)

    return jsonify({'pages':pages}), 200

@information.route("/sheets/info/", methods=["POST"])
@login_required
def sheetsInfo():
    data = request.get_json()
    if 'file_id' not in data:
        abort(400)
    file = File.query.filter_by(id=data['file_id']).first()
    if not file:
        abort(404)

    has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
        user_id=current_user.id,
        file_id=file.id,
        trashed=False
        ).first()

    if not has_access:
        abort(404)
    
    sheets_path = os.path.join(cfg.UploadFolder, file.upload_location)
    pages = files_handler.get_sheets_page_count(sheets_path)

    return jsonify({'pages':pages}), 200

@information.route("/slides/info/", methods=["POST"])
@login_required
def slidesInfo():
    data = request.get_json()
    if 'file_id' not in data:
        abort(400)
    file = File.query.filter_by(id=data['file_id']).first()
    if not file:
        abort(404)

    has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
        user_id=current_user.id,
        file_id=file.id,
        trashed=False
        ).first()

    if not has_access:
        abort(404)
    
    slides_path = os.path.join(cfg.UploadFolder, file.upload_location)
    pages = files_handler.get_slides_page_count(slides_path)

    return jsonify({'pages':pages}), 200