from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
import os
import config as cfg
from models import db, File, Access

edit = Blueprint("edit", __name__)

## Upload file to space
@edit.route('/save/<file_id>', methods=['POST'])
@login_required
def Upload(file_id):
    data = request.get_json()
    print(data)


    file = File.query.filter_by(id = file_id, trashed = False).first()

    if not file:
        return jsonify({"error": "File not found"}), 400


    if file.proprietary_id == current_user.id:
        file_path = os.path.join(cfg.UploadFolder, file.upload_location)
        

        loader = open(file_path, "r")
        old_file = loader.read()
        loader.close()

        if str(data) != old_file:
            saver = open(file_path, "w")
            saver.write(str(data))
            saver.close()
        
        return jsonify({'message': 'ok'}), 200
    
    return jsonify({"error":'File not found'})

@edit.route('/load/<file_id>', methods = ['POST'])
@login_required
def Download(file_id):

    
    file = File.query.filter_by(id = file_id, trashed = False).first()

    if not file:
        return jsonify({"error":"File not found"}), 400
    
    has_access = Access.query.filter_by(user_id = current_user.id, file_id = file.id).first()

    if file.proprietary_id == current_user.id or has_access:
        file_path = os.path.join(cfg.UploadFolder, file.upload_location)
        
        try:

            loader = open(file_path, "r")
            file = loader.read()
            loader.close()

            return jsonify(file), 200

        except FileNotFoundError:
            return jsonify(file), 400

    return jsonify({"error":'File not found'}), 400
