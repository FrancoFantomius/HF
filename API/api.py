from flask import Blueprint
api = Blueprint("api", __name__)


# Spaces Api
from API.Space.deleteAPI import trash
from API.Space.editAPI import edit
from API.Space.infoAPI import information
from API.Space.shareAPI import share
from API.Space.previewAPI import preview
from API.Space.searchAPI import search

space = Blueprint("space", __name__)

space.register_blueprint(trash, url_prefix="/") # No URL prefix because it handles both deletion and restoration 
space.register_blueprint(edit, url_prefix="/edit")
space.register_blueprint(information, url_prefix="/information")
space.register_blueprint(share, url_prefix="/share")
space.register_blueprint(preview, url_prefix="/preview")
space.register_blueprint(search, url_prefix="/search")

api.register_blueprint(space, url_prefix="/space")

# Ideas Api
from API.Ideas.searchAPI import search
from API.Ideas.editAPI import edit
from API.Ideas.infoAPI import information

ideas = Blueprint("ideas", __name__)

ideas.register_blueprint(edit, url_prefix="/edit")
ideas.register_blueprint(information, url_prefix="/information")
ideas.register_blueprint(search, url_prefix="/search")

api.register_blueprint(ideas, url_prefix="/ideas")
