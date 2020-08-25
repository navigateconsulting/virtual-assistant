"""
Endpoints file , for api code
"""

import logging
import os
import json
import redis
from celery import Celery
from app import Resource, request
from models import CustomActionsModel, ProjectsModel, \
    CopyProjectModel, DomainsModel, ConversationsModel
from models import RefreshDbModel, IntentsModel, \
    IntentDetailModel, ResponseModel, ResponseDetailModel
from models import StoryModel, StoryDetailModel, \
    EntityModel, ExportProjectModel, ImportProjectModel, \
    ValidateData
from export import Export
from rasa.run import create_agent
import asyncio


# Set logger
logger = logging.getLogger('flask.app')
logging.basicConfig(level=logging.DEBUG)


# Init model classes

CustomActionsModel = CustomActionsModel()
ProjectsModel = ProjectsModel()
CopyProjectModel = CopyProjectModel()
DomainsModel = DomainsModel()
ConversationsModel = ConversationsModel()
RefreshDbModel = RefreshDbModel()
IntentsModel = IntentsModel()
IntentDetailModel = IntentDetailModel()
ResponseModel = ResponseModel()
ResponseDetailModel = ResponseDetailModel()
StoryDetailModel = StoryDetailModel()
StoryModel = StoryModel()
EntityModel = EntityModel()
ExportProjectModel = ExportProjectModel()
ImportProjectModel = ImportProjectModel()
Export = Export()

# Setting Expiry for redis cache

GLOBAL_EXPIRY = 60

# Initiate redis
try:
    r = redis.Redis(host=os.environ['REDIS_URL'],
                    port=os.environ['REDIS_PORT'],
                    charset="utf-8", decode_responses=True,
                    password=os.environ['REDIS_PASS'])
    logger.info("Trying to connect to Redis Docker container ")
except KeyError:
    logger.debug("Local run connecting to Redis  ")
    r = redis.Redis(host='localhost', port=6379, charset="utf-8", decode_responses=True)


# Connect to celery task Queue

trainer_app = Celery('simple_worker', broker='redis://redis:6379/0', backend='redis://redis:6379/0')


# noinspection PyMethodMayBeStatic
class CustomActionsAPI(Resource):

    def get(self):

        # check if result can be served from cache
        if r.exists("all_custom_actions"):
            return json.loads(r.get("all_custom_actions"))
        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')
            result = CustomActionsModel.get_all_custom_actions()
            r.set("all_custom_actions", json.dumps(result), ex=GLOBAL_EXPIRY)
            return result

    def post(self):
        json_data = request.get_json(force=True)
        result = CustomActionsModel.create_action(json_data)

        # Clear redis cache
        r.delete("all_custom_actions")
        return result

    def put(self):

        # Updating record
        json_data = request.get_json(force=True)
        result = CustomActionsModel.update_action(json_data)

        # Clear redis cache
        r.delete("all_custom_actions")
        return result

    def delete(self):
        # Deleting record
        json_data = request.get_json()
        result = CustomActionsModel.delete_action(json_data)

        # Clear redis cache
        r.delete("all_custom_actions")
        return result


# noinspection PyMethodMayBeStatic
class Projects(Resource):

    def get(self):

        # check if result can be served from cache
        if r.exists("all_projects"):
            return json.loads(r.get("all_projects"))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = ProjectsModel.get_all_projects()
            r.set("all_projects", json.dumps(result), ex=GLOBAL_EXPIRY)

            return result

    def post(self):
        json_data = request.get_json(force=True)
        result = ProjectsModel.create_projects(json_data)

        # Clear redis cache
        r.delete("all_projects")
        return result

    def put(self):

        # Updating record
        json_data = request.get_json(force=True)
        result = ProjectsModel.update_project(json_data)

        # Clear redis cache
        r.delete("all_projects")
        return result

    def delete(self):
        # Deleting record
        object_id = request.get_json()
        result = ProjectsModel.delete_project(object_id)

        # Clear redis cache
        r.delete("all_projects")
        return result


# noinspection PyMethodMayBeStatic
class CopyProject(Resource):

    def post(self):
        json_data = request.get_json(force=True)
        result = CopyProjectModel.copy_project(json_data)

        # Clear redis cache
        r.delete("all_projects")
        return result


# noinspection PyMethodMayBeStatic
class Domains(Resource):

    def get(self, project_id):

        # check if result can be served from cache
        if r.exists("all_domains_"+str(project_id)):
            return json.loads(r.get("all_domains_"+str(project_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = DomainsModel.get_all_domains(project_id)
            r.set("all_domains_"+str(project_id), json.dumps(result), ex=GLOBAL_EXPIRY)

            return result

    def post(self, project_id):
        json_data = request.get_json(force=True)
        result = DomainsModel.create_domain(project_id, json_data)

        # Clear redis cache
        r.delete("all_domains_"+str(project_id))
        return result

    def put(self, project_id):

        # Updating record
        json_data = request.get_json(force=True)
        result = DomainsModel.update_domain(project_id, json_data)

        # Clear redis cache
        r.delete("all_domains_"+str(project_id))
        return result

    def delete(self, project_id):
        # Deleting record
        object_id = request.get_json()
        result = DomainsModel.delete_domain(project_id, object_id)

        # Clear redis cache
        r.delete("all_domains_"+str(project_id))
        return result


# noinspection PyMethodMayBeStatic
class Intents(Resource):

    def get(self):

        project_id = request.args.getlist('project_id')[0]
        domain_id = request.args.getlist('domain_id')[0]

        # check if result can be served from cache
        if r.exists("intents_"+str(project_id)+"_"+str(domain_id)):
            return json.loads(r.get("intents_"+str(project_id)+"_"+str(domain_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = IntentsModel.get_intents(project_id, domain_id)
            r.set("intents_"+str(project_id)+"_"+str(domain_id), json.dumps(result), ex=GLOBAL_EXPIRY)

            return result

    def post(self):
        json_data = request.get_json(force=True)

        project_id = json_data['project_id']
        domain_id = json_data['domain_id']

        result = IntentsModel.create_intent(json_data)

        # Clear redis cache
        r.delete("intents_"+str(project_id)+"_"+str(domain_id))
        return result

    def put(self):

        # Updating record
        json_data = request.get_json(force=True)

        project_id = json_data['project_id']
        domain_id = json_data['domain_id']

        result = IntentsModel.update_intent(json_data)

        # Clear redis cache
        r.delete("intents_"+str(project_id)+"_"+str(domain_id))
        return result

    def delete(self):
        # Deleting record
        json_data = request.get_json(force=True)

        project_id = json_data['project_id']
        domain_id = json_data['domain_id']

        result = IntentsModel.delete_intent(json_data)

        # Clear redis cache
        r.delete("intents_"+str(project_id)+"_"+str(domain_id))
        return result


# noinspection PyMethodMayBeStatic
class IntentDetails(Resource):

    def get(self, intent_id):

        # check if result can be served from cache
        if r.exists("intent_"+str(intent_id)):
            return json.loads(r.get("intent_"+str(intent_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = IntentDetailModel.get_intent_details(intent_id)
            r.set("intent_"+str(intent_id), json.dumps(result), ex=GLOBAL_EXPIRY)

            return result

    def post(self, intent_id):
        json_data = request.get_json(force=True)

        result = IntentDetailModel.insert_intent_detail(json_data)

        # Clear redis cache
        r.delete("intent_"+str(intent_id))
        return result

    def put(self, intent_id):

        # Updating record
        json_data = request.get_json(force=True)

        result = IntentDetailModel.update_intent_detail(json_data)

        # Clear redis cache
        r.delete("intent_"+str(intent_id))
        return result

    def delete(self, intent_id):
        # Deleting record
        json_data = request.get_json(force=True)

        result = IntentDetailModel.delete_intent_detail(json_data)

        # Clear redis cache
        r.delete("intent_"+str(intent_id))
        return result


# noinspection PyMethodMayBeStatic
class Responses(Resource):

    def get(self):

        project_id = request.args.getlist('project_id')[0]
        domain_id = request.args.getlist('domain_id')[0]

        # check if result can be served from cache
        if r.exists("responses_"+str(project_id)+"_"+str(domain_id)):
            return json.loads(r.get("responses_"+str(project_id)+"_"+str(domain_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = ResponseModel.get_responses(project_id, domain_id)
            r.set("responses_"+str(project_id)+"_"+str(domain_id), json.dumps(result), ex=GLOBAL_EXPIRY)

            return result

    def post(self):
        json_data = request.get_json(force=True)

        project_id = json_data['project_id']
        domain_id = json_data['domain_id']

        result = ResponseModel.create_response(json_data)

        # Clear redis cache
        r.delete("responses_"+str(project_id)+"_"+str(domain_id))
        return result

    def put(self):

        # Updating record
        json_data = request.get_json(force=True)

        project_id = json_data['project_id']
        domain_id = json_data['domain_id']

        result = ResponseModel.update_response(json_data)

        # Clear redis cache
        r.delete("responses_"+str(project_id)+"_"+str(domain_id))
        return result

    def delete(self):
        # Deleting record
        json_data = request.get_json(force=True)

        project_id = json_data['project_id']
        domain_id = json_data['domain_id']

        result = ResponseModel.delete_response(json_data)

        # Clear redis cache
        r.delete("responses_"+str(project_id)+"_"+str(domain_id))
        return result


# noinspection PyMethodMayBeStatic
class ResponseDetails(Resource):

    def get(self, response_id):

        # check if result can be served from cache
        if r.exists("response_"+str(response_id)):
            return json.loads(r.get("response_"+str(response_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = ResponseDetailModel.get_response_details(response_id)
            r.set("response_"+str(response_id), json.dumps(result), ex=GLOBAL_EXPIRY)

            return result

    def post(self, response_id):
        json_data = request.get_json(force=True)

        result = ResponseDetailModel.insert_response_detail(json_data)

        # Clear redis cache
        r.delete("response_"+str(response_id))
        return result

    # def put(self, response_id):
    #
    #     # Updating record
    #     json_data = request.get_json(force=True)
    #
    #     #response_id = json_data['object_id']
    #
    #     result = ResponseDetailModel.update_intent_detail(json_data)
    #
    #     # Clear redis cache
    #     r.delete("response_"+str(response_id))
    #     return result

    def delete(self, response_id):
        # Deleting record
        json_data = request.get_json(force=True)

        result = ResponseDetailModel.delete_response_detail(json_data)

        # Clear redis cache
        r.delete("response_"+str(response_id))
        return result


# noinspection PyMethodMayBeStatic
class Story(Resource):

    def get(self):

        project_id = request.args.getlist('project_id')[0]
        domain_id = request.args.getlist('domain_id')[0]

        # check if result can be served from cache
        if r.exists("stories_"+str(project_id)+"_"+str(domain_id)):
            return json.loads(r.get("stories_"+str(project_id)+"_"+str(domain_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = StoryModel.get_stories(project_id, domain_id)
            r.set("stories_"+str(project_id)+"_"+str(domain_id), json.dumps(result), ex=GLOBAL_EXPIRY)

            return result

    def post(self):
        json_data = request.get_json(force=True)

        project_id = json_data['project_id']
        domain_id = json_data['domain_id']

        result = StoryModel.create_story(json_data)

        # Clear redis cache
        r.delete("stories_"+str(project_id)+"_"+str(domain_id))
        return result

    def put(self):

        # Updating record
        json_data = request.get_json(force=True)

        project_id = json_data['project_id']
        domain_id = json_data['domain_id']

        result = StoryModel.update_story(json_data)

        # Clear redis cache
        r.delete("stories_"+str(project_id)+"_"+str(domain_id))
        return result

    def delete(self):
        # Deleting record
        json_data = request.get_json(force=True)

        project_id = json_data['project_id']
        domain_id = json_data['domain_id']

        result = StoryModel.delete_story(json_data)

        # Clear redis cache
        r.delete("stories_"+str(project_id)+"_"+str(domain_id))
        return result


# noinspection PyMethodMayBeStatic
class StoryDetails(Resource):

    def get(self, story_id):

        # check if result can be served from cache
        if r.exists("response_"+str(story_id)):
            return json.loads(r.get("response_"+str(story_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = StoryDetailModel.get_story_details(story_id)
            r.set("response_"+str(story_id), json.dumps(result), ex=GLOBAL_EXPIRY)

            return result

    def post(self, story_id):
        json_data = request.get_json(force=True)

        result = StoryDetailModel.insert_story_details(json_data)

        # Clear redis cache
        r.delete("response_"+str(story_id))
        return result

    def put(self, story_id):

        # Updating record
        json_data = request.get_json(force=True)

        result = StoryDetailModel.update_story_detail(json_data)

        # Clear redis cache
        r.delete("response_"+str(story_id))
        return result

    def delete(self, story_id):
        # Deleting record
        json_data = request.get_json(force=True)

        result = StoryDetailModel.delete_story_detail(json_data)

        # Clear redis cache
        r.delete("response_"+str(story_id))
        return result


# noinspection PyMethodMayBeStatic
class Entities(Resource):

    def get(self, project_id):

        # check if result can be served from cache
        if r.exists("entity_"+str(project_id)):
            return json.loads(r.get("entity_"+str(project_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = EntityModel.get_entities(project_id)
            r.set("entity_"+str(project_id), json.dumps(result), ex=GLOBAL_EXPIRY)

            return result

    def post(self, project_id):
        json_data = request.get_json(force=True)

        result = EntityModel.create_entity(json_data)

        # Clear redis cache
        r.delete("entity_"+str(project_id))
        return result

    def put(self, project_id):

        # Updating record
        json_data = request.get_json(force=True)

        result = EntityModel.update_entity(json_data)

        # Clear redis cache
        r.delete("entity_"+str(project_id))
        return result

    def delete(self, project_id):
        # Deleting record
        json_data = request.get_json(force=True)

        result = EntityModel.delete_entity(json_data)

        # Clear redis cache
        r.delete("entity_"+str(project_id))
        return result


# noinspection PyMethodMayBeStatic
class AllConversations(Resource):

    def get(self, page_number, page_size):

        logging.debug('getting Data from DB')

        result = ConversationsModel.get_all_conversations(page_number, page_size)
        r.set("conversations", json.dumps(result), ex=GLOBAL_EXPIRY)

        return result

        # # check if result can be served from cache
        # if r.exists("conversations"):
        #     return json.loads(r.get("conversations"))
        #
        # else:
        #     # Get results and update the cache with new values
        #     logging.debug('getting Data from DB')
        #
        #     result = ConversationsModel.get_all_conversations()
        #     r.set("conversations", json.dumps(result), ex=GLOBAL_EXPIRY)
        #
        #     return result


# noinspection PyMethodMayBeStatic
class Conversations(Resource):
    def get(self, conversation_id):

        result = ConversationsModel.get_conversations(conversation_id)
        return result


# noinspection PyMethodMayBeStatic
class RefreshDb(Resource):
    def get(self):

        result = RefreshDbModel.refresh_db()
        return result


# noinspection PyMethodMayBeStatic
class ExportProject(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        result = ExportProjectModel.export_project(json_data)
        return result


# noinspection PyMethodMayBeStatic
class ImportProject(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        result = ImportProjectModel.import_project(json_data)
        r.delete("all_projects")
        return result


# TODO Parallel trynow not working , need to fix
# noinspection PyMethodMayBeStatic
class TrainModel(Resource):

    def __init__(self):
        self.ValidateData = ValidateData()

    def get(self, project_id):

        logger.debug("Training model " + str(project_id))

        logger.debug("Validating project ID " + str(project_id))
        result = self.ValidateData.validate_data(project_id)

        if result != '':
            logger.debug("Validation failed for the project ")
            return {"status": "Error", "message": result}

        # Set Project Status as "Training" so that all users can see model is under training
        # Clear redis cache
        r.delete("all_projects")
        ProjectsModel.set_project_mode(mode="Training", project_id=project_id)

        result = Export.call_main(project_id)
        logger.debug(result)

        # Start Training for the model

        task_obj = trainer_app.send_task('tasks.train_model', kwargs={'project_id': project_id})
        logger.debug("Task ID "+str(task_obj.id))

        # get status

        status = trainer_app.AsyncResult(task_obj.id, app=trainer_app)
        logger.debug("Status of the task "+str(status.state))

        return {"status": "Success", "message": str(status.state), "task_id": str(task_obj.id)}


# noinspection PyMethodMayBeStatic
class TaskStatus(Resource):

    def get(self, task_id):

        status = trainer_app.AsyncResult(task_id, app=trainer_app)
        return {"Status": str(status.state)}


# noinspection PyMethodMayBeStatic
class TaskResult(Resource):

    def get(self, task_id):
        result = trainer_app.AsyncResult(task_id).result

        if result['Status'] == "Success":
            # Update the model path to Projects collection
            ProjectsModel.update_trained_model(result['Message'])

        ProjectsModel.set_project_mode(mode="Done", project_id=result['project_id'])
        # Clear redis cache
        r.delete("all_projects")
        return {"Status": result['Status'], "Message": result['Message']}


# noinspection PyMethodMayBeStatic
class LoadModel:

    agent = ''

    def load_model(self, model_path, session_id):

        from shutil import copyfile

        endpoints_file = './database_files/try_now_endpoints.yml'

        logger.debug("Making Temporary Try now model Path ")

        model_home_path = "/".join(model_path.split('/')[:-1]) + "/" + session_id
        os.mkdir(model_home_path)
        model_name = model_path.split('/')[-1]
        try_now_model_path = model_home_path + "/" + model_name

        copyfile(model_path, try_now_model_path)

        self.agent = create_agent(try_now_model_path, endpoints=endpoints_file)
        return {"Status": "Success", "Message": "Agent Loaded"}

    def handle_text(self, text_line, session_id):
        result = asyncio.run(self.agent.handle_text(text_line, sender_id=session_id))
        return result

    def delete_agent(self, model_path, session_id):

        model_home_path = "/".join(model_path.split('/')[:-1]) + "/" + session_id
        model_name = model_path.split('/')[-1]
        try_now_model_path = model_home_path + "/" + model_name

        # Clean up try now model copy
        os.remove(try_now_model_path)
        os.rmdir(model_home_path)


LoadModel = LoadModel()


# noinspection PyMethodMayBeStatic
class TryNow(Resource):

    def get(self):

        model_path = request.args.getlist('model_path')[0]
        session_id = request.args.getlist('session_id')[0]
        return LoadModel.load_model(model_path, session_id)

    def post(self):

        out_message = {}
        json_data = request.get_json(force=True)
        input_text = json_data['message']
        session_id = json_data['sessionId']

        responses = LoadModel.handle_text(input_text, session_id)

        result = ConversationsModel.get_conversations(session_id)

        if 'message' not in responses:
            out_message['tracker-store'] = result
            print('out_message', out_message)
            return out_message
        else:
            for response in responses:
                print("--------- BOT Response {}".format(response))
                response['tracker-store'] = result
                print('response', response)
                return response

    def delete(self):
        model_path = request.args.getlist('model_path')[0]
        session_id = request.args.getlist('session_id')[0]

        return LoadModel.delete_agent(model_path, session_id)


# noinspection PyMethodMayBeStatic
class PublishModel(Resource):

    def get(self):

        # Publish Model to Rasa server

        model_path = request.args.getlist('model_path')[0]

        import requests
        rasa_server_url = os.environ['RASA_SERVER']

        result = requests.put(rasa_server_url,
                              data=json.dumps({"model_file": str(model_path)}),
                              headers={'content-type': 'application/json'})

        return {"Status ": str(result.status_code), "Message": str(result.content)}


# noinspection PyMethodMayBeStatic
class ClearCache(Resource):

    def get(self, cache_name):

        logger.debug("Deleting cache"+str(cache_name))
        r.delete(cache_name)
        return "OK"
