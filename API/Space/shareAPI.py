from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from models import db, User, File, Folder, Access, SharedLinks
import sessionManager.files_handler as files_handler

share = Blueprint("share", __name__)

## Share with a user
@share.route('/email', methods = ['POST'])
@login_required
def shareEmail():
    data = request.get_json()
    
    # Sharing a Folder with a specific user
    if 'email' in data and 'folder_id' in data:
        email = data['email']
        folder_id = data['folder_id']

        user = User.query.filter_by(email = email).first()
        folder = Folder.query.filter_by(id = folder_id, trashed = False).first()

        if user and folder and folder.id == current_user.id:
            has_access = Access.query.filter_by(folder_id = folder.id, user_id = user.id, trashed = False).first()
            if not has_access:
                files_handler.share_folder(folder=folder, user_id=user.id)
            
            return jsonify({'message': 'Folder Shared'}), 200
    
    # Sharing a File with a specific user
    if 'email' in data and 'file_id' in data:
        email = data['email']
        file_id = data['file_id']

        user = User.query.filter_by(email = email).first()
        file = File.query.filter_by(id = file_id, trashed = False).first()

        if user and file and file.proprietary_id == current_user.id:
            has_access = Access.query.filter_by(file_id = file.id, user_id = user.id, trashed = False).first()
            if not has_access:
                files_handler.share_file(file=file, user_id=user.id)
                print(has_access.user_id)
            

            return jsonify({'message': 'File Shared'}), 200
        print(email + file_id)
    
    return jsonify({'error': 'File not found or user is not proprietary'}), 400

## Share by link
@share.route('/link', methods = ['POST'])
@login_required
def shareLink():
    data = request.get_json()
    # Sharing a Folder with a link
    if 'folder_id' in data:
        folder_id = data['folder_id']

        folder = Folder.query.filter_by(id = folder_id, trashed = False).first()

        if folder and folder.proprietary_id == current_user.id:
            new_link = SharedLinks(
                is_folder = True,
                true_id = folder.id,
            )
            db.session.add(new_link)
            db.session.commit()

            return jsonify({'message': 'Folder Shared', 'link': new_link.id}), 200
    
    # Sharing a File with a link
    if 'file_id' in data:
        file_id = data['file_id']

        file = File.query.filter_by(id = file_id, trashed = False).first()

        if file and file.proprietary_id == current_user.id:
            new_link = SharedLinks(
                is_folder = False,
                true_id = file.id,
            )
            db.session.add(new_link)
            db.session.commit()

            return jsonify({'message': 'File Shared', 'link': new_link.id}), 200
            
    return jsonify({'error': 'File not found or user is not proprietary'}), 400

## List all the people and links a file/folder is shared
@share.route("/info", methods = ['POST'])
@login_required
def infoShare():
    data = request.get_json()
    if 'file_id' in data:
        file = File.query.filter_by(id = data["file_id"], trashed = False).first()
        

        if not file or file.proprietary_id != current_user.id:
            return jsonify({"error": "File not found or user is not proprietary",}), 400
        
        people = Access.query.filter_by(file_id = file.id, trashed = False).all()
        links = SharedLinks.query.filter_by(true_id = file.id, is_folder = False).all()

        response = {}

        for person in people:
            person = User.query.filter_by(id = person.user_id,).first()
            if person:
                response[person.id] = {
                    'type' : 'email',
                    'id' : person.id,
                    'email' : person.email
                }
        for link in links:
            response[link.id] = {
                'type': "link",
                'id' : link.id
            }

        return jsonify(response), 200
    
    if 'folder_id' in data:
        folder = Folder.query.filter_by(id = data['folder_id'], trashed = False).first()

        if not folder or folder.proprietary_id == current_user.id:
            return jsonify({"error": "Folder not found or user is not proprietary",}), 400
        
        people = Access.query.filter_by(folder_id = folder.id, trashed = False).all()
        links = SharedLinks.query.filter_by(true_id = file.id, is_folder = True).all()

        response = {}

        for person in people:
            person = User.query.filter_by(id = person.user_id,).first()
            if person:
                response[person.id] = {
                    'type' : 'email',
                    'email' : person.email
                }
        for link in links:
            response[link.id] = {
                'type': "link",
                'id' : link.id
            }

        return jsonify(response), 200

# Remove a sharing permission
@share.route('/delete', methods = ['POST'])
@login_required
def deleteShare():
    data = request.get_json()

    if 'file_id' in data:
        file = File.query.filter_by(id = data['file_id']).first()
        has_access = file.proprietary_id == current_user.id
    
    if 'folder_id' in data:
        folder = Folder.query.filter_by(id = data['folder_id']).first()
        has_access = folder.proprietary_id == current_user.id

    if not has_access:
        return jsonify({'error': 'User is the proprietary'}), 400

    if 'email' in data:
        email = data["email"]

        user = User.query.filter_by(email=email).first()
        if user:
            access = Access.query.filter_by(user_id=user.id).first()
            if access:
                db.session.delete(access)
                db.session.commit()
                return jsonify({'message':'Success'}), 200
            
        return jsonify({"error": "File not found"}), 400
    
    if 'link' in data:

        is_folder = 'folder_id' in data

        link = SharedLinks.query.filter_by(id = data['link'], is_folder = is_folder).first()

        if link:
            db.session.delete(link)
            db.session.commit()
            return jsonify({'message':'Success'}), 200

        return jsonify({"error": "Folder not found"}), 400
