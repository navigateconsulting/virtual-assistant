from flask import Flask, request
from flask_restful import Api, Resource
import logging
from endpoints import CustomActionsAPI, Projects, CopyProject, Domains, Conversations, AllConversations, RefreshDb, IntentDetails , Intents
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

api.add_resource(CustomActionsAPI, '/custom_actions', endpoint='custom_actions')
api.add_resource(Projects, '/projects', endpoint='projects')
api.add_resource(CopyProject, '/copy_project', endpoint='copy_project')
api.add_resource(Domains, '/domains/<project_id>', endpoint="domains")
api.add_resource(AllConversations, '/all_conversations', endpoint='all_conversations')
api.add_resource(Conversations, '/conversation/<conversation_id>', endpoint='conversation')
api.add_resource(RefreshDb, '/refresh_db', endpoint='refresh_db')

api.add_resource(Intents, '/intents', endpoints='intents')
api.add_resource(IntentDetails, '/intent_details', endpoints='intent_details')

