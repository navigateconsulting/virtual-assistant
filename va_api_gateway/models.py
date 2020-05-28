from pymongo import MongoClient
import os
import json
from bson.json_util import dumps
from bson.objectid import ObjectId
import logging

# Set logger
logger = logging.getLogger('flask.app')
logging.basicConfig(level=logging.DEBUG)


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

    def delete_action(self, record):

        json_record = json.loads(json.dumps(record))
        object_id = json_record['object_id']
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

    def delete_project(self, record):

        json_record = json.loads(json.dumps(record))
        object_id = json_record['object_id']
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
class CopyProjectModel:

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


# noinspection PyMethodMayBeStatic
class IntentsModel:

    def __init__(self):
        pass

    def get_intents(self, project_id, domain_id):

        #cursor = db.intents.find({"project_id": str(project_id), "domain_id": str(domain_id)}, {"project_id": 1, "domain_id": 1, "intent_name": 1, "intent_description": 1})
        cursor = db.intents.find({"project_id": str(project_id), "domain_id": str(domain_id)})
        return json.loads(dumps(list(cursor)))

    def create_intent(self, record):

        json_record = json.loads(json.dumps(record))

        insert_record = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id'],
                         "intent_name": json_record['intent_name'],
                         "intent_description": json_record['intent_description'], "text_entities": []}

        val_res = db.intents.find_one({"project_id": json_record['project_id'],
                                             #"domain_id": json_record['domain_id'],
                                             "intent_name": json_record['intent_name']})

        if val_res is not None:
            print('Intent already exists')
            return {"status": "Error", "message": "Intent already exists"}, None
        else:
            result = db.intents.insert_one(json.loads(json.dumps(insert_record)))
            message = {"status": "Success", "message": "Intent created with ID {}".format(result.inserted_id)}

            #get_intents = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            #intents_list = self.get_intents(get_intents)

            return message

    def delete_intent(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        # Query to check intent   - {"story": {$elemMatch: {"key": "greet" }}}

        # check if intent exists in any story

        intent_detail = db.intents.find_one(query)

        exists = db.stories.find_one({"story": {"$elemMatch": {"key": intent_detail['intent_name']}}})

        if exists is None:

            result = db.intents.delete_one(query)
            print("Intent deleted successfully {}".format(result))
            message = {"status": "Success", "message": "Intent deleted successfully "}

            #get_intents = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            #intents_list = self.get_intents(get_intents)

            return message
        else:

            message = {"status": "Error", "message": "Intent is used in a story cannot delete this intent"}
            return message

    def update_intent(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"intent_name": json_record['intent_name'],
                                 "intent_description": json_record['intent_description']}}

        # Check if intent already exists
        val_res = db.intents.find_one({"project_id": json_record['project_id'],
                                             #"domain_id": json_record['domain_id'],
                                             "intent_name": json_record['intent_name']})

        if val_res is None or val_res['intent_name'] == json_record['intent_name']:

            update_record = db.intents.update_one(query, update_field)

            print("Intent Updated , rows modified {}".format(update_record))

            #get_intents = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            #intents_list = self.get_intents(get_intents)

            return {"status": "Success", "message": "Intent Updated Successfully"}
        else:
            return {"status": "Error", "message": "Intent Name already exists"}


# noinspection PyMethodMayBeStatic
class IntentDetailModel:

    def __init__(self):
        pass

    def get_intent_details(self, intent_id):

        query = {"_id": ObjectId("{}".format(intent_id))}
        cursor = db.intents.find_one(query)
        logger.debug("Inside Intent Details ")
        return json.loads(dumps(cursor))

    def insert_intent_detail(self, data):

        # Data format - No check for Intent already exists
        # {"object_id":"", "text":"I am in india ","entities":[{"start":8,"end":13,"value":"india","entity":"timezone"}]}

        json_record = json.loads(json.dumps(data))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        object_id = json_record['object_id']
        del json_record['object_id']

        result = db.intents.update_one(query, {"$addToSet": {"text_entities": json_record}})
        print("Inserted new row in Intent {}".format(result))

        #intent_detail = self.get_intent_details({"object_id": object_id})
        print("Result of Intent Addition {}".format(result.modified_count))
        if result.modified_count == 1:
            return {"status": "Success", "message": "Intent text added "}
        else:
            return {"status": "Error", "message": "Intent already exists "}

    def update_intent_detail(self, data):

        json_record = json.loads(json.dumps(data))

        object_id = json_record['object_id']
        index = json_record['doc_index']
        del json_record['object_id']
        del json_record['doc_index']
        query = {"_id": ObjectId("{}".format(object_id))}
        result = db.intents.update_one(query, {"$set": {"text_entities."+index: json_record}})
        print("Record updated {}".format(result))

        #intent_detail = self.get_intent_details({"object_id": object_id})
        return {"status": "Success", "message": "Intent Updated successfully"}

    def delete_intent_detail(self, data):

        """
         input type :
        {"object_id": "", "text":"I am in india ","entities":[{"start":8,"end":13,"value":"india","entity":"timezone"}]}
        """

        json_record = json.loads(json.dumps(data))
        object_id = json_record['object_id']
        del json_record['object_id']

        intent_detail = self.get_intent_details(object_id)
        print("Intent Details count {}".format(intent_detail['text_entities'][0]))

        try:
            res = intent_detail['text_entities'][1]
        except IndexError:
            return {"status": "Error", "message": "At least one record should be present for an Intent"}, intent_detail

        query = {"_id": ObjectId("{}".format(str(object_id)))}
        result = db.intents.update_one(query, {"$pull": {"text_entities": json_record}})
        print("Removed row from Intent {}".format(result))

        return {"status": "Success", "message": "Intent text Removed "}


# noinspection PyMethodMayBeStatic
class ResponseModel:

    def __init__(self):
        pass

    def get_responses(self, project_id, domain_id):

        #json_record = json.loads(json.dumps(record))

        #cursor = db.responses.find({"project_id": str(project_id), "domain_id": str(domain_id)}, {"project_id": 1, "domain_id": 1, "response_name": 1, "response_description": 1})
        cursor = db.responses.find({"project_id": str(project_id), "domain_id": str(domain_id)})
        return json.loads(dumps(list(cursor)))

    def create_response(self, record):

        json_record = json.loads(json.dumps(record))

        insert_record = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id'],
                         "response_name": json_record['response_name'],
                         "response_description": json_record['response_description'], "text_entities": []}

        val_res = db.responses.find_one({"project_id": json_record['project_id'],
                                               #"domain_id": json_record['domain_id'],
                                               "response_name": json_record['response_name']})

        if val_res is not None:
            print('Response already exists')
            return {"status": "Error", "message": "Response already exists"}
        else:

            result = db.responses.insert_one(json.loads(json.dumps(insert_record)))
            print("Response created with ID {}".format(result.inserted_id))

            #get_responses = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            #responses_list = self.get_responses(get_responses)

            return {"status": "Success", "message": "Response created successfully"}

    def delete_response(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        # check if response exists in any story

        response_detail = db.responses.find_one(query)

        exists = db.stories.find_one({"story": {"$elemMatch": {"key": response_detail['response_name']}}})

        if exists is None:

            result = db.responses.delete_one(query)
            print("Response Deleted count {}".format(result))

            #get_responses = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            #responses_list = self.get_responses(get_responses)

            return {"status": "Success", "message": "Response Deleted successfully"}
        else:
            return {"status": "Error", "message": "Response exists in story cannot delete response"}

    def update_response(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"response_name": json_record['response_name'],
                                 "response_description": json_record['response_description']}}

        # Check if Response already exists
        val_res = db.responses.find_one({"project_id": json_record['project_id'],
                                               #"domain_id": json_record['domain_id'],
                                               "response_name": json_record['response_name']})

        if val_res is None or val_res['response_name'] == json_record['response_name']:
            update_record = db.responses.update_one(query, update_field)

            print("Response Updated , rows modified {}".format(update_record))

            #get_responses = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            #responses_list = self.get_responses(get_responses)

            return {"status": "Success", "message": "Response Updated successfully"}
        else:
            return {"status": "Error", "message": "Response Name already exists"}


# noinspection PyMethodMayBeStatic
class ResponseDetailModel:

    def __init__(self):
        pass

    def get_response_details(self, response_id):

        query = {"_id": ObjectId("{}".format(response_id))}
        cursor = db.responses.find_one(query)
        return json.loads(dumps(cursor))

    def insert_response_detail(self, data):

        json_record = json.loads(json.dumps(data))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        object_id = json_record['object_id']
        del json_record['object_id']

        # to Prevent Duplicates

        result = db.responses.update_one(query, {"$addToSet": {"text_entities": json_record['text_entities']}})

        print("Inserted new row in Intent {}".format(result.modified_count))

        #intent_detail = self.get_response_details({"object_id": object_id})

        if result.modified_count == 1:
            return {"status": "Success", "message": "Response added "}
        else:
            return {"status": "Error", "message": "Response Already exists "}

    def delete_response_detail(self, data):

        # {"object_id": "", "text":"I am in india ","entities":[{"start":8,"end":13,"value":"india","entity":"timezone"}] }

        json_record = json.loads(json.dumps(data))
        object_id = json_record['object_id']
        del json_record['object_id']

        response_detail = self.get_response_details(object_id)
        try:
            res = response_detail['text_entities'][1]
        except IndexError:
            return {"status": "Error", "message": "Atleast one record should be present for an Response"}

        query = {"_id": ObjectId("{}".format(str(object_id)))}

        result = db.responses.update_one(query, {"$pull": {"text_entities": json_record['text_entities']}})
        print("Removed row from Intent {}".format(result))

        #response_detail = self.get_response_details({"object_id": object_id})
        return {"status": "Success", "message": "Response text Removed "}


# noinspection PyMethodMayBeStatic
class StoryModel:

    def __init__(self):
        pass

    def get_stories(self, project_id, domain_id):

        #json_record = json.loads(json.dumps(record))

        cursor = db.stories.find({"project_id": str(project_id), "domain_id": str(domain_id)}, {"project_id": 1, "domain_id": 1, "story_name": 1, "story_description": 1})
        return json.loads(dumps(list(cursor)))

    def create_story(self, record):

        json_record = json.loads(json.dumps(record))

        insert_record = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id'],
                         "story_name": json_record['story_name'],
                         "story_description": json_record['story_description'], "story": []}

        val_res = db.stories.find_one({"project_id": json_record['project_id'],
                                             "domain_id": json_record['domain_id'],
                                             "story_name": json_record['story_name']})

        if val_res is not None:
            print('Story already exists')
            return {"status": "Error", "message": "Story already exists"}, None

        else:

            result = db.stories.insert_one(json.loads(json.dumps(insert_record)))
            print("Story created with ID {}".format(result.inserted_id))

            #get_stories = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            #stories_list = self.get_stories(get_stories)

            return {"status": "Success", "message": "Story created successfully "}

    def delete_story(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        result = db.stories.delete_one(query)
        print("Story Deleted count {}".format(result))

        #get_stories = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        #stories_list = self.get_stories(get_stories)

        return {"status": "Success", "message": "Story Deleted successfully"}

    def update_story(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"story_name": json_record['story_name'],
                                 "story_description": json_record['story_description']}}

        # Check if Response already exists
        val_res = db.stories.find_one({"project_id": json_record['project_id'],
                                             "domain_id": json_record['domain_id'],
                                             "story_name": json_record['story_name']})

        if val_res is None or val_res['story_name'] == json_record['story_name']:

            update_record = db.stories.update_one(query, update_field)
            print("Story Updated , rows modified {}".format(update_record))

            #get_stories = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            #stories_list = self.get_stories(get_stories)
            return {"status": "Success", "message": "Story Updated successfully "}

        else:
            return {"status": "Error", "message": "Story Name already exists"}


# TODO : where does this fit ?
#     async def get_only_story_details(self, data):
#
#         json_record = json.loads(json.dumps(data))
#         query = {"_id": ObjectId("{}".format(json_record['object_id']))}
#         result = await db.stories.find_one(query)
#         print("Story Details sent {}".format(json.loads(dumps(result))))
#         return result
#
#

# noinspection PyMethodMayBeStatic
class StoryDetailModel:

    def __init__(self):
        pass

    def get_story_details(self, story_id):

        query = {"_id": ObjectId("{}".format(story_id))}
        cursor = db.stories.find_one(query)
        return json.loads(dumps(cursor))



        # TODO  - Verify if this works If intents or responses are created , when user is in Story details page , all intents / responses should be
        #  broadcast to this room as well

        # # Get intents
        # # cursor = db.intents.find({"project_id": json_record['project_id'], "domain_id": json_record['domain_id']})
        #
        # cursor = db.intents.find({"project_id": json_record['project_id']})
        # result_intents = cursor.to_list(length=1000)
        # intents_list = json.loads(dumps(result_intents))
        #
        # # Get Responses
        # # cursor = db.responses.find({"project_id": json_record['project_id'], "domain_id": json_record['domain_id']})
        #
        # cursor = db.responses.find({"project_id": json_record['project_id']})
        # result_response = cursor.to_list(length=1000)
        # response_list = json.loads(dumps(result_response))
        #
        # # get actions
        # cursor = db.actions.find({})
        # result_action = cursor.to_list(length=1000)
        # action_list = json.loads(dumps(result_action))
        #
        # return json.loads(dumps(result)), intents_list, response_list, action_list

    def insert_story_details(self, data):

        # {'object_id':"", "position":"", "story": ["key":"abc", "value":"", "type": "intent",
        #                           "entities": [{"entity_name": "test entity", "entity_value": "Test"}]]}

        json_record = json.loads(json.dumps(data))
        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        position = json_record['position']

        result = db.stories.update_one(query, {"$push": {"story": {"$each": json_record['story'],
                                                                         "$position": position}
                                                               }})

        print("Story Details Updated {}".format(result))

        # story_details, intents_list, response_list, actions_list = self.get_story_details({"object_id": json_record['object_id'],
        #                                                                            "project_id": json_record['project_id'],
        #                                                                            "domain_id": json_record['domain_id']})

        return {"status": "Success", "message": "Story created"}

    def delete_story_detail(self, data):

        json_record = json.loads(json.dumps(data))
        object_id = json_record['object_id']
        index = json_record['doc_index']

        query = {"_id": ObjectId("{}".format(object_id))}

        # Unset the record at  position provided and then pull it to properly remove the element
        result1 = db.stories.update_one(query, {"$unset": {"story."+str(index): 1}})

        result = db.stories.update_one(query, {"$pull": {"story": None}})

        print("Removed row from Story {}".format(result))

        # story_detail,  intents_list, response_list,actions_list = self.get_story_details({"object_id": json_record['object_id'],
        #                                                                            "project_id": json_record['project_id'],
        #                                                                            "domain_id": json_record['domain_id']})
        return {"status": "Success", "message": "Story element Removed "}

    def update_story_detail(self, data):

        json_record = json.loads(json.dumps(data))

        object_id = json_record['object_id']
        index = json_record['doc_index']
        query = {"_id": ObjectId("{}".format(object_id))}
        result = db.stories.update_one(query, {"$set": {"story."+str(index): json_record['story']}})
        print("Record updated {}".format(result))

        # story_detail,  intents_list, response_list, actions_list = self.get_story_details({"object_id": json_record['object_id'],
        #                                                                            "project_id": json_record['project_id'],
        #                                                                            "domain_id": json_record['domain_id']})
        return {"status": "Success", "message": "Story Updated successfully"}


# noinspection PyMethodMayBeStatic
class EntityModel:

    def __init__(self):
        pass

    def get_entities(self, project_id):

        query = {"project_id": project_id}
        cursor = db.entities.find(query)
        return json.loads(dumps(list(cursor)))

    def create_entity(self, record):

        json_record = json.loads(json.dumps(record))

        # Check if Entity already exists
        val_res = db.entities.find_one({"project_id": json_record['project_id'],
                                              "entity_name": json_record['entity_name']})

        if val_res is not None:
            print("Entity Already exists ")
            return {"status": "Error", "message": "Entity Already exists "}, None
        else:
            result = db.entities.insert_one(json_record)
            print("Entity created with ID {}".format(result.inserted_id))

            # get_entities = {"project_id": json_record['project_id']}
            # entities_list = self.get_entities(get_entities)

            return {"status": "Success", "message": "Entity created successfully"}

    def delete_entity(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        # check if entity is used in any Intent
        # {"text_entities": {"$elemMatch":  {"entities.entity": "location_value"} }}

        entity_detail = db.entities.find_one(query)

        res = db.intents.find_one({"text_entities": {"$elemMatch":  {"entities.entity": entity_detail['entity_name']}}})

        res2 = db.responses.find_one({"text_entities": "/"+entity_detail['entity_name']+"/"})

        if res is None and res2 is None:

            result = db.entities.delete_one(query)
            print("Entity Deleted count {}".format(result))

            # get_entities = {"project_id": json_record['project_id']}
            # entities_list = self.get_entities(get_entities)

            return {"status": "Success", "message": "Entity deleted successfully"}
        elif res is None:
            return {"status": "Error", "message": "Unable to delete entity , its used in an Response"}
        else:
            return {"status": "Error", "message": "Unable to delete entity , its used in an Intent"}

    def update_entity(self, record):

        json_record = json.loads(json.dumps(record))

        # Check if Entity already exists
        val_res = db.entities.find_one({"project_id": json_record['project_id'],
                                              "entity_name": json_record['entity_name']})

        object_id = val_res.get('_id')
        query = {"_id": ObjectId("{}".format(object_id))}

        if val_res is None or val_res['entity_name'] == json_record['entity_name']:
            del json_record['_id']
            print("Got value ", json_record)
            update_record = db.entities.update_one(query, {"$set": json_record})
            print("Entity Updated , rows modified {}".format(update_record.modified_count))

            # get_entities = {"project_id": json_record['project_id']}
            # entities_list = self.get_entities(get_entities)
            return {"status": "Success", "message": "Entity updated successfully"}

        else:
            return {"status": "Error", "message": "Entity Name already exists"}


# noinspection PyMethodMayBeStatic
class ConversationsModel:

    def __init__(self):
        pass

    def get_all_conversations(self):
        cursor = db.conversations.find()
        return json.loads(dumps(list(cursor)))

    def get_conversations(self, sender_id):
        print("Pulling tracker data for a conversation")

        result = db.conversations.find_one({"sender_id": sender_id})
        return json.loads(dumps(result))


# noinspection PyMethodMayBeStatic
class RefreshDbModel:

    def refresh_db(self):
        print('received request to refresh database')

        # Setting source data paths

        #seed_data_path = CONFIG.get('api_gateway', 'SEED_DATA_PATH')
        seed_data_path = './database_files/'

        # Cleaning up collections
        db.entities.delete_many({})

        db.projects.delete_many({})
        db.domains.delete_many({})
        db.intents.delete_many({})
        db.responses.delete_many({})
        db.stories.delete_many({})
        db.conversations.delete_many({})
        db.actions.delete_many({})

        # Inserting Data in collection

        with open(seed_data_path+'projects.json') as json_file:
            data = json.load(json_file)
            db.projects.insert_many(data)

        # Get project ID

        project = db.projects.find_one({})
        project_id = project.get('_id')
        print("project ID {}".format(project_id))

        with open(seed_data_path+'domains.json') as json_file:
            data = json.load(json_file)
            db.domains.insert_many(data)

        db.domains.update_many({}, {'$set': {'project_id': str(project_id)}})
        domain_id = db.domains.find_one({})

        with open(seed_data_path+'intents.json') as json_file:
            data = json.load(json_file)
            db.intents.insert_many(data)

        db.intents.update_many({}, {'$set': {'project_id': str(project_id), 'domain_id': str(domain_id.get('_id'))}})

        with open(seed_data_path+'entities.json') as json_file:
            data = json.load(json_file)
            db.entities.insert_many(data)

        db.entities.update_many({}, {'$set': {'project_id': str(project_id)}})

        with open(seed_data_path+'responses.json') as json_file:
            data = json.load(json_file)
            db.responses.insert_many(data)

        db.responses.update_many({}, {'$set': {'project_id': str(project_id), 'domain_id': str(domain_id.get('_id'))}})

        with open(seed_data_path+'stories.json') as json_file:
            data = json.load(json_file)
            db.stories.insert_many(data)

        db.stories.update_many({}, {'$set': {'project_id': str(project_id), 'domain_id': str(domain_id.get('_id'))}})

        with open(seed_data_path+'actions.json') as json_file:
            data = json.load(json_file)
            db.actions.insert_many(data)

        return {"status": "Success", "message": "Database Refreshed"}


# noinspection PyMethodMayBeStatic
class ExportProjectModel:

    def __init__(self):
        pass

    def export_project(self, json_record):
        #{"project_name": "BaseDomain"}

        print("Inside Export project")

        export_model = {'project': '',
                        'entities': '',
                        'domains': '',
                        'intents': '',
                        'response': '',
                        'stories': ''}

        source_project = db.projects.find_one({"project_name": json_record['project_name']})
        source_project_id = source_project.get('_id')
        del source_project['_id']

        # Create Project

        export_model["project"] = source_project

        # Copy Entities

        entities_cursor = db.entities.find({"project_id": str(source_project_id)})
        entities_list = entities_cursor.to_list(length=10000)
        entity_dict = []
        for entities in entities_list:
            del entities['_id']
            entity_dict.append(entities)
        export_model["entities"] = entity_dict

        # Copy Domains

        domains_cursor = db.domains.find({"project_id": str(source_project_id)})
        domain_list = []
        for domain in domains_cursor.to_list(length=100):
            print(domain.get('_id'))
            domain['source_domain'] = str(domain.get('_id'))
            del domain['_id']
            domain_list.append(domain)
        export_model["domains"] = domain_list

        # Copy Intents
        intents_cursor = db.intents.find({"project_id": str(source_project_id)})
        intents_list = []
        for intents in intents_cursor.to_list(length=100):
            del intents['_id']
            intents_list.append(intents)
        export_model["intents"] = intents_list

        # Copy Responses

        responses_cursor = db.responses.find({"project_id": str(source_project_id)})
        response_list = []
        for response in responses_cursor.to_list(length=100):
            del response['_id']
            response_list.append(response)
        export_model["response"] = response_list

        # Copy Stories

        stories_cursor = db.stories.find({"project_id": str(source_project_id)})
        story_list = []
        for story in stories_cursor.to_list(length=100):
            del story['_id']
            story_list.append(story)
        export_model["stories"] = story_list

        print(json.loads(dumps(export_model)))
        return json.loads(dumps(export_model))


# noinspection PyMethodMayBeStatic
class ImportProjectModel:

    def __init__(self):
        pass

    def import_project(self, json_record):

        # Create Project
        #json_record = eval(record)
        #json_record = record
        #json_record = json.loads(json.dumps(record))
        print(json_record['project'])

        # Check if project already exists

        val_res = db.projects.find_one({"project_name": json_record['project']['project_name']})

        if val_res is not None:
            print('Project already exists')
            return {"status": "Error", "message": "Project already exists"}

        # Remove later
        new_project = db.projects.insert_one(json_record['project'])
        print("project created {}".format(new_project.inserted_id))

        # Copy Entities

        entities = json_record["entities"]
        for lines in entities:
            lines['project_id'] = "{}".format(new_project.inserted_id)
            new_entity = db.entities.insert_one(lines)
            print(lines)


        # Copy Domains

        domains = json_record['domains']
        for lines in domains:
            print(lines)
            source_domain = lines['source_domain']
            lines['project_id'] = "{}".format(new_project.inserted_id)
            new_domain = db.domains.insert_one(lines)
            print("new domain inserted with id {}".format(new_domain.inserted_id))

            intents = json_record['intents']
            for intent_lines in intents:
                if intent_lines['domain_id'] == source_domain:
                    print("insert with new domain ID ")
                    intent_lines['project_id'] = "{}".format(new_project.inserted_id)
                    intent_lines['domain_id'] = "{}".format(new_domain.inserted_id)
                    new_intents = db.intents.insert_one(intent_lines)

            responses = json_record['response']
            for response_lines in responses:
                if response_lines['domain_id'] == source_domain:
                    print("insert with new domain ID ")
                    response_lines['project_id'] = "{}".format(new_project.inserted_id)
                    response_lines['domain_id'] = "{}".format(new_domain.inserted_id)
                    new_responses = db.responses.insert_one(response_lines)

            story = json_record['stories']
            for story_lines in story:
                if story_lines['domain_id'] == source_domain:
                    print("insert with new domain ID ")
                    story_lines['project_id'] = "{}".format(new_project.inserted_id)
                    story_lines['domain_id'] = "{}".format(new_domain.inserted_id)
                    new_story = db.stories.insert_one(story_lines)

        return {"status": "Success", "message": "Project successfully imported "}


# noinspection PyMethodMayBeStatic
class ValidateData:
    def __int__(self):
        pass

    def validate_data(self, project_id):
        ret_val = ''
        query = {"project_id": project_id}

        # TODO
        #  Intent 'intent1' has only 1 training examples! Minimum is 2, training may fail
        #  Story must have valid data in it

        # Check for count of Intents in project

        cursor = db.intents.find(query)
        result = cursor.to_list(length=10)
        print("Count of intents in Project {}".format(len(result)))

        if len(result) < 1:
            ret_val = ret_val + "Atleast one Intent should be defined in the Project \n"

        # Check for count of Responses in project

        cursor = db.responses.find(query)
        result = cursor.to_list(length=10)
        print("Count of Responses in Project {}".format(len(result)))

        if len(result) < 1:
            ret_val = ret_val + "Atleast one Response should be defined in the Project \n"

        # Check for count of Story in project

        cursor = db.stories.find(query)
        result = cursor.to_list(length=10)
        print("Count of Stories in Project {}".format(len(result)))

        if len(result) < 1:
            ret_val = ret_val + "Atleast one Story should be defined in the Project \n"
        else:
            # get the first story
            try:
                print("First story from the result {}".format(result[0]['story'][0]))
            except IndexError:
                ret_val = ret_val + "Story {} should have atleast one Intent and Response ".format(result[0]['story_name'])

        # Check for count of Entity in project

        cursor = db.entities.find(query)
        result = cursor.to_list(length=10)
        print("Count of entities in Project {}".format(len(result)))

        if len(result) < 1:
            ret_val = ret_val + "Atleast one Entity should be defined in the Project \n"

        # checks for two stage fallback policy
        # Check for Negative Intent if its present.

        cursor = db.intents.find({"project_id": project_id, "intent_name": "negative"})
        result = cursor.to_list(length=10)
        print("Count of negative intents in Project {}".format(len(result)))

        if len(result) < 1:
            ret_val = ret_val + "Intent 'negative' should be defined in the Project \n"

        # check for utter_default
        cursor = db.responses.find({"project_id": project_id, "response_name": "utter_default"})
        result = cursor.to_list(length=10)
        print("Count of Responses in Project {}".format(len(result)))

        if len(result) < 1:
            ret_val = ret_val + "Response default should be defined in the Project \n"

        # check for utter_ask_rephrase
        cursor = db.responses.find({"project_id": project_id, "response_name": "utter_ask_rephrase"})
        result = cursor.to_list(length=10)
        print("Count of Responses in Project {}".format(len(result)))

        if len(result) < 1:
            ret_val = ret_val + "Response ask_rephrase should be defined in the Project \n"

        return ret_val
