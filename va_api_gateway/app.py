from flask import Flask, request
from flask_restful import Api, Resource
import logging
from endpoints import CustomActionsAPI, Projects, CopyProject
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Set up api for flask restful
api = Api(app)

# Setup Logging
gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.DEBUG)


# Set API routes
#api.add_resource(CustomActionsAPI, '/custom_actions/<int:id>', endpoint='custom_actions')

api.add_resource(CustomActionsAPI, '/custom_actions', endpoint='custom_actions')
api.add_resource(Projects, '/projects', endpoint='projects')
api.add_resource(CopyProject, '/copy_project', endpoint='copy_project')
