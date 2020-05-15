from app import Resource, request
import redis
import os
import logging
from models import CustomActionsModel, ProjectsModel, CopyProject, DomainsModel, ConversationsModel, RefreshDbModel
import json

# Set logger
logger = logging.getLogger('flask.app')
logging.basicConfig(level=logging.DEBUG)


# Init model classes

CustomActionsModel = CustomActionsModel()
ProjectsModel = ProjectsModel()
CopyProject = CopyProject()
DomainsModel = DomainsModel()
ConversationsModel = ConversationsModel()
RefreshDbModel = RefreshDbModel()

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
        result = CopyProject.copy_project(json_data)

        # Clear redis cache
        r.delete("all_projects")
        return result


# noinspection PyMethodMayBeStatic
class Domains(Resource):

    def get(self, project_id):

        # check if result can be served from cache
        if r.exists("domains_"+str(project_id)):
            return json.loads(r.get("all_domains"+str(project_id)))

        else:
            # Get results and update the cache with new values
            logging.debug('getting Data from DB')

            result = DomainsModel.get_all_domains(project_id)
            r.set("domains_"+str(project_id), json.dumps(result), ex=60)

            return result

    def post(self, project_id):
        json_data = request.get_json(force=True)
        result = DomainsModel.create_domain(project_id, json_data)

        # Clear redis cache
        r.delete("domains_"+str(project_id))
        return result

    def put(self, project_id):

        # Updating record
        json_data = request.get_json(force=True)
        result = DomainsModel.update_domain(project_id, json_data)

        # Clear redis cache
        r.delete("domains_"+str(project_id))
        return result

    def delete(self, project_id):
        # Deleting record
        object_id = request.get_json()
        result = DomainsModel.delete_domain(project_id, object_id)

        # Clear redis cache
        r.delete("domains_"+str(project_id))
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
    def get(self, conversation_id):

        result = RefreshDbModel.refresh_db()
        return result
