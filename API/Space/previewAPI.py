from flask import Blueprint, request, send_file, abort, jsonify
from flask_login import current_user, login_required
from models import db, File, Access
import config as cfg
import io
import os
import sessionManager.toImage as toImage


preview = Blueprint("preview", __name__)

@preview.route("/image/<file_id>")
@login_required
def previewImage(file_id):
    file = File.query.filter_by(id=file_id).first()
    if file:
        has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
            user_id=current_user.id,
            file_id=file_id,
            trashed=False
            ).first()
        if has_access:
            return send_file(os.path.join(cfg.UploadFolder, file.upload_location), download_name=file.name)
    abort(400)

@preview.route("/pdf/<file_id>/<page_nmb>")
@login_required
def previewPdf(file_id, page_nmb):
    file = File.query.filter_by(id=file_id).first()
    if not file:
        abort(400)

    has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
        user_id=current_user.id,
        file_id=file_id,
        trashed=False
        ).first()

    if not has_access:
        abort(400)
    
    pdf_path = os.path.join(cfg.UploadFolder, file.upload_location)
    try:
        page_nmb = int(page_nmb)

        image = toImage.pdf_page_to_image(pdf_path, page_nmb)
         
        # Create an in-memory byte stream to store the image
        img_io = io.BytesIO()
        image.save(img_io, 'PNG')
        img_io.seek(0)  # Seek back to the start of the byte stream
        
        # Return the image as a response
        return send_file(img_io, mimetype='image/png')
    
    except ValueError:
        abort(500)

@preview.route('/document/<file_id>')
@login_required
def previewDoc(file_id):
    file = File.query.filter_by(id=file_id).first()
    if not file:
        abort(400)

    has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
        user_id=current_user.id,
        file_id=file_id,
        trashed=False
        ).first()

    if not has_access:
        abort(400)
    
    
    doc_path = os.path.join(cfg.UploadFolder, file.upload_location)

    # If it's not a .txt or .docx it cannot show a preview
    if not (doc_path.endswith(".txt") or doc_path.endswith(".docx")):
        abort(400)
    
    if doc_path.endswith(".docx"):
        image = toImage.docx_to_image(doc_path)

    if doc_path.endswith(".txt"):
        image = toImage.txt_to_image(doc_path)

    # Create an in-memory byte stream to store the image
    img_io = io.BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)  # Seek back to the start of the byte stream
    
    # Return the image as a response
    return send_file(img_io, mimetype='image/png')


@preview.route('/sheet/<file_id>/<sheet_nmb>')
@login_required
def previewSheet(file_id, sheet_nmb):
    file = File.query.filter_by(id=file_id).first()
    if not file:
        abort(400)

    has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
        user_id=current_user.id,
        file_id=file_id,
        trashed=False
        ).first()

    if not has_access:
        abort(400)
    
    doc_path = os.path.join(cfg.UploadFolder, file.upload_location)

    if doc_path.endswith('.xlsx') or doc_path.endswith('.xls') or doc_path.endswith('.ods'):
        image = toImage.excel_sheet_to_images(doc_path, sheet_nmb)
    
    elif doc_path.endswith(".csv"):
        image = toImage.csv_to_images(doc_path)

    else:
        abort(400)

    
    # Return the image as a response
    return send_file(image, mimetype='image/png')


@preview.route('/slides/<file_id>/<slide_nmb>')
@login_required
def previewSlide(file_id, slide_nmb):
    file = File.query.filter_by(id=file_id).first()
    if not file:
        abort(400)

    has_access = file.proprietary_id == current_user.id or Access.query.filter_by(
        user_id=current_user.id,
        file_id=file_id,
        trashed=False
        ).first()

    if not has_access:
        abort(400)
    
    doc_path = os.path.join(cfg.UploadFolder, file.upload_location)

    if doc_path.endswith('.pptx'):
        image = toImage.pptx_to_images(doc_path, slide_nmb)
    
    else:
        abort(400)
    
    # Create an in-memory byte stream to store the image
    img_io = io.BytesIO()
    image.save(img_io, 'PNG')
    img_io.seek(0)  # Seek back to the start of the byte stream
    
    # Return the image as a response
    return send_file(img_io, mimetype='image/png')