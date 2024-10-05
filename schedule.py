from models import db, File, Folder, Trashcan, Access
from datetime import datetime, timezone, timedelta
from sessionManager.files_handler import remove_file, remove_folder

def empty_trashcan():
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)

    # Query entries older than 30 days
    old_entries = Trashcan.query.filter(Trashcan.created_at < thirty_days_ago).all()

    # Process each old entry
    for entry in old_entries:
        delete_from_trashcan(entry)

def delete_from_trashcan(entry):
    if entry.is_folder == True:
        folder = Folder.query.filter_by(id = entry.old_id).first()
        remove_folder(folder)
    else:
        file = File.query.filter_by(id=entry.old_id).first()
        remove_file(file)
    
    # Delete the record
    db.session.delete(entry)
    db.session.commit()
