""" Flask app entry point
    starts a gunicorn server form dockerfile file
"""


import logging
from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from endpoints import CustomActionsAPI, Projects, CopyProject, \
     Domains, Conversations, AllConversations, RefreshDb
from endpoints import IntentDetails, Intents, Story, \
    StoryDetails, Entities, Responses, ResponseDetails
from endpoints import ExportProject, ImportProject, TrainModel, TaskStatus, TaskResult


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

api.add_resource(Intents, '/intents', endpoint='intents')
api.add_resource(IntentDetails, '/intent_details/<intent_id>', endpoint='intent_details')

api.add_resource(Responses, '/responses', endpoint='responses')
api.add_resource(ResponseDetails, '/responses_details/<response_id>', endpoint='responses_details')

api.add_resource(Story, '/story', endpoint='story')
api.add_resource(StoryDetails, '/story_details/<story_id>', endpoint='story_details')

api.add_resource(Entities, '/entities/<project_id>', endpoint='entities')

api.add_resource(ExportProject, '/export_model', endpoint='export_model')
api.add_resource(ImportProject, '/import_model', endpoint='import_model')

api.add_resource(TrainModel, '/train/<project_id>', endpoint='train')

api.add_resource(TaskStatus, '/task_status/<task_id>', endpoint='task_status')
api.add_resource(TaskResult, '/task_result/<task_id>', endpoint='task_result')

