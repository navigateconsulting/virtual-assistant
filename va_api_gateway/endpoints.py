from app import Resource, request
import redis
import os
import logging
from models import CustomActionsModel, ProjectsModel, CopyProjectModel, DomainsModel, ConversationsModel
from models import RefreshDbModel, IntentsModel, IntentDetailModel, ResponseModel, ResponseDetailModel
from models import StoryModel, StoryDetailModel, EntityModel, ExportModel, ImportModel
import json

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
ExportModel = ExportModel()
ImportModel = ImportModel()

# Initiate redis
try:
    r = redis.Redis(host=os.environ['REDIS_URL'], port=os.environ['REDIS_PORT'], charset="utf-8", decode_responses=True)
    logger.info("Trying to connect to Redis Docker container ")
except KeyError:
    logger.debug("Local run connecting to Redis  ")
    r = redis.Redis(host='localhost', port=6379, charset="utf-8", decode_responses=True)


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
            r.set("all_custom_actions", json.dumps(result), ex=60)

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
            r.set("all_projects", json.dumps(result), ex=60)

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
            r.set("all_domains_"+str(project_id), json.dumps(result), ex=60)

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
            r.set("intents_"+str(project_id)+"_"+str(domain_id), json.dumps(result), ex=60)

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
            r.set("intent_"+str(intent_id), json.dumps(result), ex=60)

            return result

    def post(self, intent_id):
        json_data = request.get_json(force=True)

        #intent_id = json_data['object_id']

        result = IntentDetailModel.insert_intent_detail(json_data)

        # Clear redis cache
        r.delete("intent_"+str(intent_id))
        return result

    def put(self, intent_id):

        # Updating record
        json_data = request.get_json(force=True)

        #intent_id = json_data['object_id']

        result = IntentDetailModel.update_intent_detail(json_data)

        # Clear redis cache
        r.delete("intent_"+str(intent_id))
        return result

    def delete(self, intent_id):
        # Deleting record
        json_data = request.get_json(force=True)

        #intent_id = json_data['object_id']

        result = IntentDetailModel.delete_intent_detail(json_data)

        # Clear redis cache
        r.delete("intent_"+str(intent_id))
        return result


# noinspection PyMethodMayBeStatic
class Responses(Resource):

    def get(self):

        # json_data = request.get_json(force=True)
        #
        # project_id = json_data['project_id']
        # domain_id = json_data['domain_id']
        project_id = request.args.getlist('project_id')[0]
        domain_id = request.args.getlist('domain_id')[0]


        # check if result can be served from cache
        if r.exists("responses_"+str(project_id)+"_"+str(domain_id)):
            return json.loads(r.get("responses_"+str(project_id)+"_"+str(domain_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = ResponseModel.get_responses(project_id, domain_id)
            r.set("responses_"+str(project_id)+"_"+str(domain_id), json.dumps(result), ex=60)

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

            result = IntentDetailModel.get_intent_details(response_id)
            r.set("response_"+str(response_id), json.dumps(result), ex=60)

            return result

    def post(self):
        json_data = request.get_json(force=True)

        response_id = json_data['object_id']

        result = IntentDetailModel.insert_intent_detail(json_data)

        # Clear redis cache
        r.delete("response_"+str(response_id))
        return result

    def put(self):

        # Updating record
        json_data = request.get_json(force=True)

        response_id = json_data['object_id']

        result = IntentDetailModel.update_intent_detail(json_data)

        # Clear redis cache
        r.delete("response_"+str(response_id))
        return result

    def delete(self):
        # Deleting record
        json_data = request.get_json(force=True)

        response_id = json_data['object_id']

        result = IntentDetailModel.delete_intent_detail(json_data)

        # Clear redis cache
        r.delete("response_"+str(response_id))
        return result


# noinspection PyMethodMayBeStatic
class Story(Resource):

    def get(self):

        # json_data = request.get_json(force=True)
        #
        # project_id = json_data['project_id']
        # domain_id = json_data['domain_id']

        project_id = request.args.getlist('project_id')[0]
        domain_id = request.args.getlist('domain_id')[0]

        # check if result can be served from cache
        if r.exists("stories_"+str(project_id)+"_"+str(domain_id)):
            return json.loads(r.get("stories_"+str(project_id)+"_"+str(domain_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = StoryModel.get_stories(project_id, domain_id)
            r.set("stories_"+str(project_id)+"_"+str(domain_id), json.dumps(result), ex=60)

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
            r.set("response_"+str(story_id), json.dumps(result), ex=60)

            return result

    def post(self):
        json_data = request.get_json(force=True)

        story_id = json_data['object_id']

        result = StoryDetailModel.insert_story_details(json_data)

        # Clear redis cache
        r.delete("response_"+str(story_id))
        return result

    def put(self):

        # Updating record
        json_data = request.get_json(force=True)

        story_id = json_data['object_id']

        result = StoryDetailModel.update_story_detail(json_data)

        # Clear redis cache
        r.delete("response_"+str(story_id))
        return result

    def delete(self):
        # Deleting record
        json_data = request.get_json(force=True)

        story_id = json_data['object_id']

        result = StoryDetailModel.delete_story_detail(json_data)

        # Clear redis cache
        r.delete("response_"+str(story_id))
        return result


# noinspection PyMethodMayBeStatic
class Entities(Resource):

    def get(self, entity_id):

        # check if result can be served from cache
        if r.exists("entity_"+str(entity_id)):
            return json.loads(r.get("entity_"+str(entity_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = EntityModel.get_entities(entity_id)
            r.set("entity_"+str(entity_id), json.dumps(result), ex=60)

            return result

    def post(self):
        json_data = request.get_json(force=True)

        entity_id = json_data['object_id']

        result = EntityModel.create_entity(json_data)

        # Clear redis cache
        r.delete("entity_"+str(entity_id))
        return result

    def put(self):

        # Updating record
        json_data = request.get_json(force=True)

        entity_id = json_data['object_id']

        result = EntityModel.update_entity(json_data)

        # Clear redis cache
        r.delete("entity_"+str(entity_id))
        return result

    def delete(self):
        # Deleting record
        json_data = request.get_json(force=True)

        entity_id = json_data['object_id']

        result = EntityModel.delete_entity(json_data)

        # Clear redis cache
        r.delete("entity_"+str(entity_id))
        return result


# noinspection PyMethodMayBeStatic
class AllConversations(Resource):

    def get(self):

        # check if result can be served from cache
        if r.exists("conversations"):
            return json.loads(r.get("conversations"))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = ConversationsModel.get_all_conversations()
            r.set("conversations", json.dumps(result), ex=60)

            return result


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
class ExportModel(Resource):
    def get(self):

        result = ExportModel.export_project()
        return result


# noinspection PyMethodMayBeStatic
class ImportModel(Resource):
    def get(self):

        result = ImportModel.import_project()
        return result
