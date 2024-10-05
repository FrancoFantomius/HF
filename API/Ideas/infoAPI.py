from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from models import db, File, User, Access, Folder

information = Blueprint("info", __name__)


## All the content in a folder
@information.route('/viewcontent', methods = ['POST'])
@login_required
def viewNotes():
    files = File.query.filter_by(type = 'note', trashed = False).order_by(File.last_modified_date).all()

    response = {}
    
    for file in files:
        response[file.id] = {
            'id' : file.id,
            'name' : file.name
            }
    return jsonify(response), 200