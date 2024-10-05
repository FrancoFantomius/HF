from flask import Blueprint, request, abort, jsonify
from flask_login import current_user, login_required
from models import db, File, Access
import sessionManager.search as srch
import os
import config as cfg

search = Blueprint("search", __name__)

@search.route('/files', methods = ['POST'])
@login_required
def searchFiles():
    data = request.get_json()
    if 'text' in data:
        text = data["text"]
        files = File.query.filter_by(proprietary_id = current_user.id, trashed = False).all()
        
        # Gets all the files shared with the current user
        files_shared = Access.query.filter_by(user_id = current_user.id, folder_id = None, trashed = False).all()
        
        for file_shared in files_shared:
            file = File.query.filter_by(id = file_shared.file_id).first()
            files.append(file)
        
        usefull_files = {}

        for file in files:
            path = os.path.join(cfg.UploadFolder, file.upload_location)
            result = text in file.name or srch.search_text_in_file(text, path)
            
            if result:
                usefull_files[file.id] = {
                    'type' : 'file/' + file.type,
                    'id' : file.id,
                    'name': file.name,
                }

        return jsonify(usefull_files)
    return jsonify({'error': 'No text provided'}), 400

