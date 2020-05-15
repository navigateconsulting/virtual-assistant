from pymongo import MongoClient
import os
import json
from bson.json_util import dumps
from bson.objectid import ObjectId


try:
    client = MongoClient(os.environ['MONGODB_HOST'], int(os.environ['MONGODB_PORT']))
except KeyError:
    client = MongoClient('localhost', 27017)


db = client.eva_platform


# noinspection PyMethodMayBeStatic
class CustomActionsModel:
    def __init__(self):
        pass

    def get_all_custom_actions(self):
        cursor = db.actions.find()
        return json.loads(dumps(list(cursor)))

    def create_action(self, record):

        json_record = json.loads(json.dumps(record))

        # Validation to check if action already exists

        val_res = db.actions.find_one({"action_name": json_record['action_name']})

        if val_res is not None:
            print('Action already exists')
            return {"status": "Error", "message": "Action already exists"}
        else:
            result = db.actions.insert_one(json_record)
            print("Action created {}".format(result.inserted_id))
            return {"status": "Success", "message": "Action Has Been Created"}

    def update_action(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"action_description": json_record['action_description']
                                 }}
        result = db.actions.update_one(query, update_field)
        print("Action Updated , rows modified {}".format(result))
        return {"status": "Success", "message": "Action details updated successfully "}

    def delete_action(self, object_id):
        query = {"_id": ObjectId("{}".format(object_id))}

        # Delete Action
        result = db.actions.delete_one(query)
        print("Action Deleted count {}".format(result))
        return {"status": "Success", "message": "Action Deleted Successfully"}


# Data Model for Projects

# noinspection PyMethodMayBeStatic
class ProjectsModel:

    def __init__(self):
        pass

    def get_all_projects(self):
        cursor = db.projects.find()
        return json.loads(dumps(list(cursor)))

    def create_projects(self, record):

        json_record = json.loads(json.dumps(record))
        # Validation to check if project already exists

        val_res = db.projects.find_one({"project_name": json_record['project_name']})

        if val_res is not None:
            print('Project already exists')
            return {"status": "Error", "message": "Project already exists"}
        else:
            result = db.projects.insert_one(json_record)
            print("project created {}".format(result.inserted_id))
            return {"status": "Success", "message": "Project Created with ID {}".format(result.inserted_id)}

    def delete_project(self, object_id):
        query = {"_id": ObjectId("{}".format(object_id))}

        # Delete Domains Intents , Entities , Stories , Responses

        result = db.domains.delete_many({"project_id": object_id})
        print("Domains Deleted - count {}".format(result))

        result = db.intents.delete_many({"project_id": object_id})
        print("Intents Deleted - count {}".format(result))

        result = db.entities.delete_many({"project_id": object_id})
        print("Entities Deleted - count {}".format(result))

        result = db.stories.delete_many({"project_id": object_id})
        print("Stories Deleted - count {}".format(result))

        result = db.responses.delete_many({"project_id": object_id})
        print("Responses Deleted - count {}".format(result))

        # Delete Project
        result = db.projects.delete_one(query)
        print("Project Deleted count {}".format(result))
        return {"status": "Success", "message": "Project Deleted Successfully"}

    def update_project(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        if 'config_description' in json_record:
            update_field = {"$set": {"configuration": json_record['config_description']
                                     }}
        elif 'project_description' in json_record:
            update_field = {"$set": {"project_description": json_record['project_description']
                                     }}
        else:
            return {"status": "Error", "message": "Nothing to update"}

        result = db.projects.update_one(query, update_field)
        print("Project Updated , rows modified {}".format(result))
        return {"status": "Success", "message": "Project details updated successfully "}


# noinspection PyMethodMayBeStatic
class CopyProject:

    def copy_project(self, record):
        json_record = json.loads(json.dumps(record))

        # check if the project name exists

        val_res = db.projects.find_one({"project_name": json_record['project_name']})

        if val_res is not None:
            print('Project already exists')
            return {"status": "Error", "message": "Project already exists"}
        else:

            # get source project ID

            source_project = db.projects.find_one({"project_name": json_record['source']})
            source_project_id = source_project.get('_id')
            print("Source project ID {}".format(source_project_id))

            # Create Project

            new_project = db.projects.insert_one(json_record)
            print("project created {}".format(new_project.inserted_id))

            # Copy Entities

            entities_cursor = db.entities.find({"project_id": str(source_project_id)})
            for entity in entities_cursor.to_list(length=100):
                del entity['_id']
                entity['project_id'] = "{}".format(new_project.inserted_id)
                new_entity = db.entities.insert_one(entity)
                print("new entity inserted with id {}".format(new_entity.inserted_id))

            # Copy domains

            domains_cursor = db.domains.find({"project_id": str(source_project_id)})
            for domain in domains_cursor.to_list(length=100):
                source_domain_id = domain.get('_id')
                del domain['_id']
                domain['project_id'] = "{}".format(new_project.inserted_id)
                new_domain = db.domains.insert_one(domain)
                print("new domain inserted with id {}".format(new_domain.inserted_id))

                # Copy Intents

                intents_cursor = db.intents.find(
                    {"project_id": str(source_project_id), "domain_id": str(source_domain_id)})
                for intents in intents_cursor.to_list(length=100):
                    del intents['_id']
                    intents['project_id'] = "{}".format(new_project.inserted_id)
                    intents['domain_id'] = "{}".format(new_domain.inserted_id)
                    new_intents = db.intents.insert_one(intents)
                    print("new intents inserted with id {}".format(new_intents.inserted_id))

                # Copy Responses

                responses_cursor = db.responses.find(
                    {"project_id": str(source_project_id), "domain_id": str(source_domain_id)})
                for response in responses_cursor.to_list(length=100):
                    del response['_id']
                    response['project_id'] = "{}".format(new_project.inserted_id)
                    response['domain_id'] = "{}".format(new_domain.inserted_id)
                    new_responses = db.responses.insert_one(response)
                    print("new response inserted with id {}".format(new_responses.inserted_id))

                # Copy Stories

                stories_cursor = db.stories.find(
                    {"project_id": str(source_project_id), "domain_id": str(source_domain_id)})
                for story in stories_cursor.to_list(length=100):
                    del story['_id']
                    story['project_id'] = "{}".format(new_project.inserted_id)
                    story['domain_id'] = "{}".format(new_domain.inserted_id)
                    new_story = db.stories.insert_one(story)
                    print("new story inserted with id {}".format(new_story.inserted_id))

            return {"status": "Success", "message": "Project Copied ID {}".format(new_project.inserted_id)}


# TODO : Merge this with model publish code
class PublishModel:
    def update_project_model(self, record):
        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"model_name": json_record['model_name'],
                                 "state": json_record['state']
                                 }}

        res_archived = db.projects.update_many({"state": "Published"}, {"$set": {"state": "Archived"}})
        result = db.projects.update_one(query, update_field)

        print("Projects set to Archived state {}".format(res_archived))
        print("Project Updated , rows modified {}".format(result))
        return {"status": "Success", "message": "Model Published "}


# noinspection PyMethodMayBeStatic
class DomainsModel:

    def __init__(self):
        pass

    def get_all_domains(self, project_id):
        query = {"project_id": project_id}
        cursor = db.domains.find(query)
        return json.loads(dumps(list(cursor)))

    def create_domain(self, project_id, record):

        json_record = json.loads(json.dumps(record))

        insert_record = {"project_id": project_id, "domain_name": json_record['domain_name'],
                         "domain_description": json_record['domain_description']}

        # Check if domain exists already

        val_res = db.domains.find_one({"project_id": project_id,
                                       "domain_name": json_record['domain_name']})

        if val_res is not None:
            print('Domain already exists')
            return {"status": "Error", "message": "Domain already exists"}, None
        else:
            insert_result = db.domains.insert_one(json.loads(json.dumps(insert_record)))
            print("Domain created with ID {}".format(insert_result.inserted_id))

            #domains_list = self.get_all_domains(json_record['project_id'])
            return {"status": "Success", "message": "Domain created successfully"}

    def delete_domain(self, project_id, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        result = db.intents.delete_many({"domain_id": json_record['object_id']})
        print("Intents Deleted - count {}".format(result))

        result = db.stories.delete_many({"domain_id": json_record['object_id']})
        print("Stories Deleted - count {}".format(result))

        result = db.responses.delete_many({"domain_id": json_record['object_id']})
        print("Responses Deleted - count {}".format(result))

        delete_record = db.domains.delete_one(query)
        print("Domain Deleted count {}".format(delete_record))

        #domains_list = self.get_domains(json_record['project_id'])

        return {"status": "Success", "message": "Domain Deleted Successfully"}

    def update_domain(self, project_id, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"domain_name": json_record['domain_name'],
                                 "domain_description": json_record['domain_description']}}

        # Check if Domain already exists
        val_res = db.domains.find_one({"project_id": project_id,
                                       "domain_name": json_record['domain_name']})

        if val_res is None:
            update_record = db.domains.update_one(query, update_field)
            print("Domain Updated , rows modified {}".format(update_record))

            #domains_list = self.get_domains(json_record['project_id'])
            return {"status": "Success", "message": "Domain updated successfully "}

        elif val_res['domain_name'] == json_record['domain_name']:
            print("updating domain description")

            update_record = db.domains.update_one(query, update_field)
            print("Domain Updated , rows modified {}".format(update_record))

            #domains_list = self.get_domains(json_record['project_id'])
            return {"status": "Success", "message": "Domain updated successfully "}

        else:
            print('Domain already exists')
            return {"status": "Error", "message": "Domain already exists"}

