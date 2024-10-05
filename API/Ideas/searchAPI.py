from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from models import File, Access

search = Blueprint("search", __name__)

@search.route('/', methods = ['POST'])
@login_required
def searchFiles():
    data = request.get_json()
    if 'text' in data:
        text = data["text"]
        files = File.query.filter_by(proprietary_id = current_user.id, trashed = False, type = "note").all()
        
        # Gets all the files shared with the current user
        files_shared = Access.query.filter_by(user_id = current_user.id, folder_id = None, trashed = False).all()
        
        for file_shared in files_shared:
            file = File.query.filter_by(id = file_shared.file_id, type = "note").first()
            files.append(file)
        
        usefull_files = {}

        for file in files:
            result = text in file.name

            if result:
                usefull_files[file.id] = {
                    'type' : 'file/' + file.type,
                    'id' : file.id,
                    'name': file.name,
                }

        return jsonify(usefull_files), 200
    
    return jsonify({'error': 'No text provided'}), 400