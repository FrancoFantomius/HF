import os
from datetime import datetime
import config as cfg
from models import db, File, Folder, Access, Trashcan
import os
import fitz #PyMuPDF
import pandas as pd 
from pptx import Presentation

def create_path(file_name):
    '''
    Creates the path for the file to be saved in compliance with the Database rules
    '''
    # Create the subfolder path based on the current date
    today = datetime.today()
    subfolder_path = os.path.join(cfg.UploadFolder, today.strftime('%Y\\%m\\%d'))

    # Ensure the subfolder exists
    os.makedirs(subfolder_path, exist_ok=True)

    # Determine the new file name
    base_name, extension = os.path.splitext(file_name)
    counter = 1
    new_file_name = f"{base_name}{extension}"
    full_path = os.path.join(subfolder_path, new_file_name)

    # Check if the full path exceeds 250 characters
    while len(full_path) > 250:
        base_name = base_name[:-1]
        new_file_name = f"{base_name}{extension}"
        full_path = os.path.join(subfolder_path, new_file_name)

    # Ensure the file name is unique
    while os.path.exists(full_path):
        new_file_name = f"{base_name}#{counter}{extension}"
        full_path = os.path.join(subfolder_path, new_file_name)
        counter += 1
    
    return os.path.join(today.strftime('%Y\\%m\\%d'), new_file_name)

def remove_file(file:File):
    '''
    Function to remove already present File from the database and the location where it has been saved.
    '''
    file_path = os.path.join(cfg.UploadFolder, file.upload_location)
    permissions = Access.query.filter_by(file_id=file.id).all()
    file_trashcan = Trashcan.query.filter_by(old_id=file.id, is_folder = False).first()
    for permission in permissions:
        db.session.delete(permission)
    db.session.delete(file)
    db.session.delete(file_trashcan)
    db.session.commit()
    if os.path.exists(file_path):
        os.remove(file_path)

def remove_folder(folder:Folder):
    '''
    Function to remove already present Folder from the database, NOTE: all the files and subfolders are recursively deleted
    '''
    subfolders = Folder.query.filter_by(parent_folder_id=folder.id).all()
    files = File.query.filter_by(folder_id=folder.id).all()
    permissions = Access.query.filter_by(folder_id=folder.id).all()
    folder_trashcan = Trashcan.query.filter_by(old_id = folder.id, is_folder = True).first()
    for permission in permissions:
        db.session.delete(permission)
    for file in files:
        remove_file(file)
    for subfolder in subfolders:
        remove_folder(subfolder)
    db.session.delete(folder)
    db.session.delete(folder_trashcan)
    db.session.commit()

def trash_file(file:File):
    # Puts in the trashcan the file and disable the sharing permissions

    file.trashed = True
    permissions = Access.query.filter_by(file_id=file.id).all()
    for permission in permissions:
        permission.trashed = True
    trash = Trashcan(proprietary_id = file.proprietary_id,
                     old_id = file.id,
                     name = file.name,
                     is_folder = False)
    db.session.add(trash)
    db.session.commit()

def trash_folder(folder:Folder):
    
    # Gets all the subfolders
    subfolders = Folder.query.filter_by(parent_folder_id=folder.id).all()
    
    # Gets all the files 
    files = File.query.filter_by(folder_id=folder.id).all()
    
    # Gets all the share permissions
    permissions = Access.query.filter_by(folder_id=folder.id).all()
    
    # Puts in the trashcan all that has retrieved
    for permission in permissions:
        permission.trashed = True
    for file in files:
        trash_file(file)
    for subfolder in subfolders:
        trash_folder(subfolder)
    trash = Trashcan(proprietary_id = folder.proprietary_id,
                     old_id = folder.id,
                     name = folder.name,
                     is_folder = True)
    db.session.add(trash)

    # Puts the tag trashed on the folder
    folder.trashed = True
    
    db.session.commit()

def restore_file(file:File):
    # Gets the file from the trashcan
    fileTrash = Trashcan.query.filter_by(old_id=file.id, is_folder = False).first()

    # Gets all the sharing permissions related to the file
    permissions = Access.query.filter_by(file_id = file.id).all()
    
    for permission in permissions:
        permission.trashed = False
    
    # Restore the file from the database
    db.session.delete(fileTrash)
    file.trashed = False
    db.session.commit()


def restore_folder(folder:Folder):
    # Gets the subfolder
    subfolders = Folder.query.filter_by(parent_folder_id = folder.id).all()

    # Gets the files
    files = File.query.filter_by(folder_id = folder.id).all()

    # Gets the sharing permissions
    permissions = Access.query.filter_by(folder_id = folder.id).all()

    # Removes the elements from the trashcan database
    trashFolder = Trashcan.query.filter_by(folder_id = folder.id).first()

    # Restores the files
    for file in files:
        restore_file(file)

    # Restores the subfolders
    for subfolder in subfolders:
        restore_folder(subfolder)
    
    # Restores all the sharing permissions
    for permission in permissions:
        permission.trashed = False
    

    folder.trashed = False
    db.session.delete(trashFolder)
    db.session.commit()

def share_file(file:File, user_id):
    new_access = Access(
        user_id = user_id,
        file_id = file.id,
    )
    
    db.session.add(new_access)
    db.session.commit()

def share_folder(folder:Folder, user_id):
    subfolders = Folder.query.filter_by(parent_folder_id = folder.id).all()
    files = File.query.filter_by(folder_id = folder.id).all()

    for file in files:
        share_file(file, user_id)
    
    for subfolder in subfolders:
        share_folder(subfolder, user_id)
    
    new_access = Access(
        user_id = user_id,
        folder_id = folder.id,
    )

    db.session.add(new_access)
    db.session.commit()


# Detects the type of a file based on its extension name
def get_type(file_name:str):
    file_types = {
        "document": ['.doc', '.docx', '.txt', '.odt', '.rtf'],
        "sheet": ['.xls', '.xlsx', '.csv', '.ods'],
        "slide": ['.ppt', '.pptx', '.odp'],
        "image": ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.svg'],
        "video": ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'],
        "pdf": ['.pdf'],
        "note": [".excalidraw"],
        "other": []
    }

    # Get the file extension
    file_extension = file_name[file_name.rfind('.'):].lower()

    # Determine file type based on extension
    for file_type, extensions in file_types.items():
        if file_extension in extensions:
            return file_type
    
    # If no match, return 'other'
    return "other"

def get_pdf_page_count(pdf_path):
    """
    Returns the number of pages in a PDF file.

    :param pdf_path: Path to the PDF file.
    :return: Number of pages in the PDF.
    """
    # Open the PDF file
    pdf_document = fitz.open(pdf_path)
    
    # Get the number of pages
    page_count = pdf_document.page_count
    
    # Close the PDF document
    pdf_document.close()
    
    return page_count

def get_sheets_page_count(sheet_path):
    """
    Returns the number of sheets in a Excell/Open document equivalent/csv file.

    :param sheet_path: Path to the PDF file.
    :return: Number of pages in the PDF.
    """
    # A csv file has a single sheet
    if sheet_path.endswith('.csv'):
        return 1
    
    else:
        excel_file = pd.ExcelFile(sheet_path)
        return len(excel_file.sheet_names)


def get_slides_page_count(slides_path):
    """
    Returns the number of sheets in a .pptx file.

    :param sheet_path: Path to the PDF file.
    :return: Number of pages in the PDF.
    """
    prs = Presentation(slides_path)

    return len(prs.slides)