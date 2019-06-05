from bson.json_util import dumps
import json
from bson.objectid import ObjectId
from database import ConDatabase
from config import CONFIG


'''motor Mongo Db connection '''

db = ConDatabase.connect()


# noinspection PyMethodMayBeStatic
class RasaConversations:

    async def get_conversations(self, sender_id):
        print("Pulling tracker data for a conversation")

        result = await db.conversations.find_one({"sender_id": sender_id})
        return json.loads(dumps(result))


# noinspection PyMethodMayBeStatic
class RefreshDb:

    async def refresh_db(self):
        print('received request to refresh database')

        # Setting source data paths

        seed_data_path = CONFIG.get('backend-trainer', 'SEED_DATA_PATH')

        # Cleaning up collections
        await db.entities.delete_many({})

        await db.projects.delete_many({})
        await db.domains.delete_many({})
        await db.intents.delete_many({})
        await db.responses.delete_many({})
        await db.stories.delete_many({})
        await db.conversations.delete_many({})

        # Inserting Data in collection

        with open(seed_data_path+'projects.json') as json_file:
            data = json.load(json_file)
            await db.projects.insert_many(data)

        # Get project ID

        project = await db.projects.find_one({})
        project_id = project.get('_id')
        print("project ID {}".format(project_id))

        with open(seed_data_path+'domains.json') as json_file:
            data = json.load(json_file)
            await db.domains.insert_many(data)

        await db.domains.update_many({}, {'$set': {'project_id': str(project_id)}})
        domain_id = await db.domains.find_one({})

        with open(seed_data_path+'intents.json') as json_file:
            data = json.load(json_file)
            await db.intents.insert_many(data)

        await db.intents.update_many({}, {'$set': {'project_id': str(project_id), 'domain_id': str(domain_id.get('_id'))}})

        with open(seed_data_path+'entities.json') as json_file:
            data = json.load(json_file)
            await db.entities.insert_many(data)

        await db.entities.update_many({}, {'$set': {'project_id': str(project_id)}})

        with open(seed_data_path+'responses.json') as json_file:
            data = json.load(json_file)
            await db.responses.insert_many(data)

        await db.responses.update_many({}, {'$set': {'project_id': str(project_id), 'domain_id': str(domain_id.get('_id'))}})

        with open(seed_data_path+'stories.json') as json_file:
            data = json.load(json_file)
            await db.stories.insert_many(data)

        await db.stories.update_many({}, {'$set': {'project_id': str(project_id), 'domain_id': str(domain_id.get('_id'))}})

        return "Success"


# noinspection PyMethodMayBeStatic
class ProjectsModel:

    def __init__(self):
        pass

    async def get_projects(self):
        cursor = db.projects.find()
        result = await cursor.to_list(length=1000)
        print("Projects sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def create_projects(self, record):

        json_record = json.loads(json.dumps(record))

        # Validation to check if project already exists

        val_res = await db.projects.find_one({"project_name": json_record['project_name']})

        if val_res is not None:
            print('Project already exists')
            return {"status": "Error", "message": "Project already exists"}
        else:
            result = await db.projects.insert_one(json_record)
            print("project created {}".format(result.inserted_id))
            return {"status": "Success", "message": "Project Created with ID {}".format(result.inserted_id)}

    async def delete_project(self, object_id):
        query = {"_id": ObjectId("{}".format(object_id))}

        # Delete Domains Intents , Entities , Stories , Responses

        result = await db.domains.delete_many({"project_id": object_id})
        print("Domains Deleted - count {}".format(result))

        result = await db.intents.delete_many({"project_id": object_id})
        print("Intents Deleted - count {}".format(result))

        result = await db.entities.delete_many({"project_id": object_id})
        print("Entities Deleted - count {}".format(result))

        result = await db.stories.delete_many({"project_id": object_id})
        print("Stories Deleted - count {}".format(result))

        result = await db.responses.delete_many({"project_id": object_id})
        print("Responses Deleted - count {}".format(result))

        # Delete Project
        result = await db.projects.delete_one(query)
        print("Project Deleted count {}".format(result))
        return {"status": "Success", "message": "Project Deleted Successfully"}

    async def update_project(self, record):

        json_record = json.loads(json.dumps(record))

        val_res = await db.projects.find_one({"project_name": json_record['project_name']})

        if val_res is not None:
            print('Project already exists')
            return {"status": "Error", "message": "Project name already exists"}
        else:
            query = {"_id": ObjectId("{}".format(json_record['object_id']))}
            update_field = {"$set": {"project_name": json_record['project_name'],
                                     "project_description": json_record['project_description']
                                     }}
            result = db.projects.update_one(query, update_field)
            print("Project Updated , rows modified {}".format(result))
            return {"status": "Success", "message": "Project details updated successfully"}

    async def copy_project(self, record):
        json_record = json.loads(json.dumps(record))

        # check if the project name exists

        val_res = await db.projects.find_one({"project_name": json_record['project_name']})

        if val_res is not None:
            print('Project already exists')
            return {"status": "Error", "message": "Project already exists"}
        else:

            # get source project ID

            source_project = await db.projects.find_one({"project_name": json_record['source']})
            source_project_id = source_project.get('_id')
            print("Source project ID {}".format(source_project_id))

            # Create Project

            new_project = await db.projects.insert_one(json_record)
            print("project created {}".format(new_project.inserted_id))

            # Copy Entities

            entities_cursor = db.entities.find({"project_id": str(source_project_id)})
            for entity in await entities_cursor.to_list(length=100):
                del entity['_id']
                entity['project_id'] = "{}".format(new_project.inserted_id)
                new_entity = await db.entities.insert_one(entity)
                print("new entity inserted with id {}".format(new_entity.inserted_id))

            # Copy domains

            domains_cursor = db.domains.find({"project_id": str(source_project_id)})
            for domain in await domains_cursor.to_list(length=100):
                source_domain_id = domain.get('_id')
                del domain['_id']
                domain['project_id'] = "{}".format(new_project.inserted_id)
                new_domain = await db.domains.insert_one(domain)
                print("new domain inserted with id {}".format(new_domain.inserted_id))

                # Copy Intents

                intents_cursor = db.intents.find({"project_id": str(source_project_id), "domain_id": str(source_domain_id)})
                for intents in await intents_cursor.to_list(length=100):
                    del intents['_id']
                    intents['project_id'] = "{}".format(new_project.inserted_id)
                    intents['domain_id'] = "{}".format(new_domain.inserted_id)
                    new_intents = await db.intents.insert_one(intents)
                    print("new intents inserted with id {}".format(new_intents.inserted_id))

                # Copy Responses

                responses_cursor = db.responses.find({"project_id": str(source_project_id), "domain_id": str(source_domain_id)})
                for response in await responses_cursor.to_list(length=100):
                    del response['_id']
                    response['project_id'] = "{}".format(new_project.inserted_id)
                    response['domain_id'] = "{}".format(new_domain.inserted_id)
                    new_responses = await db.responses.insert_one(response)
                    print("new response inserted with id {}".format(new_responses.inserted_id))

                # Copy Stories

                stories_cursor = db.stories.find({"project_id": str(source_project_id), "domain_id": str(source_domain_id)})
                for story in await stories_cursor.to_list(length=100):
                    del story['_id']
                    story['project_id'] = "{}".format(new_project.inserted_id)
                    story['domain_id'] = "{}".format(new_domain.inserted_id)
                    new_story = await db.stories.insert_one(story)
                    print("new story inserted with id {}".format(new_story.inserted_id))

            return {"status": "Success", "message": "Project Copied ID {}".format(new_project.inserted_id)}


# noinspection PyMethodMayBeStatic
class DomainsModel:

    def __init__(self):
        pass

    async def get_domains(self, project_id):
        query = {"project_id": project_id}
        cursor = db.domains.find(query)
        result = await cursor.to_list(length=1000)
        print("Domains sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def create_domain(self, record):

        json_record = json.loads(json.dumps(record))

        insert_record = {"project_id": json_record['project_id'], "domain_name": json_record['domain_name'],
                         "domain_description": json_record['domain_description']}

        # Check if domain exists already

        val_res = await db.domains.find_one({"project_id": json_record['project_id'],
                                             "domain_name": json_record['domain_name']})

        if val_res is not None:
            print('Domain already exists')
            return {"status": "Error", "message": "Domain already exists"}, None
        else:
            insert_result = await db.domains.insert_one(json.loads(json.dumps(insert_record)))
            print("Domain created with ID {}".format(insert_result.inserted_id))

            domains_list = await self.get_domains(json_record['project_id'])
            return {"status": "Success", "message": "Domain created successfully"}, domains_list

    async def delete_domain(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        result = await db.intents.delete_many({"domain_id": json_record['object_id']})
        print("Intents Deleted - count {}".format(result))

        result = await db.stories.delete_many({"domain_id": json_record['object_id']})
        print("Stories Deleted - count {}".format(result))

        result = await db.responses.delete_many({"domain_id": json_record['object_id']})
        print("Responses Deleted - count {}".format(result))

        delete_record = await db.domains.delete_one(query)
        print("Domain Deleted count {}".format(delete_record))

        domains_list = await self.get_domains(json_record['project_id'])

        return {"status": "Success", "message": "Domain Deleted Successfully"}, domains_list

    async def update_domain(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"domain_name": json_record['domain_name'],
                                 "domain_description": json_record['domain_description']}}

        # Check if Domain already exists
        val_res = await db.domains.find_one({"project_id": json_record['project_id'],
                                             "domain_name": json_record['domain_name']})

        if val_res is None:
            update_record = await db.domains.update_one(query, update_field)
            print("Domain Updated , rows modified {}".format(update_record))

            domains_list = await self.get_domains(json_record['project_id'])
            return {"status": "Success", "message": "Domain updated successfully "}, domains_list

        elif val_res['domain_name'] == json_record['domain_name']:
            print("updating domain description")

            update_record = await db.domains.update_one(query, update_field)
            print("Domain Updated , rows modified {}".format(update_record))

            domains_list = await self.get_domains(json_record['project_id'])
            return {"status": "Success", "message": "Domain updated successfully "}, domains_list

        else:
            print('Domain already exists')
            return {"status": "Error", "message": "Domain already exists"}, None


# noinspection PyMethodMayBeStatic
class IntentsModel:

    def __init__(self):
        pass

    async def get_intents(self, record):

        json_record = json.loads(json.dumps(record))

        cursor = db.intents.find(json_record, {"project_id": 1, "domain_id": 1, "intent_name": 1, "intent_description": 1})
        result = await cursor.to_list(length=1000)
        json_result = json.loads(dumps(result))
        print("Intents sent {}".format(json_result))
        return json_result

    async def create_intent(self, record):

        json_record = json.loads(json.dumps(record))

        insert_record = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id'],
                         "intent_name": json_record['intent_name'],
                         "intent_description": json_record['intent_description'], "text_entities": []}

        val_res = await db.intents.find_one({"project_id": json_record['project_id'],
                                             "domain_id": json_record['domain_id'],
                                             "intent_name": json_record['intent_name']})

        if val_res is not None:
            print('Intent already exists')
            return {"status": "Error", "message": "Intent already exists"}, None
        else:
            result = await db.intents.insert_one(json.loads(json.dumps(insert_record)))
            message = {"status": "Success", "message": "Intent created with ID {}".format(result.inserted_id)}

            get_intents = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            intents_list = await self.get_intents(get_intents)

            return message, intents_list

    async def delete_intent(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        result = await db.intents.delete_one(query)
        print("Intent deleted successfully {}".format(result))
        message = {"status": "Success", "message": "Intent deleted successfully "}

        get_intents = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        intents_list = await self.get_intents(get_intents)

        return message, intents_list

    async def update_intent(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"intent_name": json_record['intent_name'],
                                 "intent_description": json_record['intent_description']}}

        # Check if intent already exists
        val_res = await db.intents.find_one({"project_id": json_record['project_id'],
                                             "domain_id": json_record['domain_id'],
                                             "intent_name": json_record['intent_name']})

        if val_res is None or val_res['intent_name'] == json_record['intent_name']:

            update_record = await db.intents.update_one(query, update_field)

            print("Intent Updated , rows modified {}".format(update_record))

            get_intents = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            intents_list = await self.get_intents(get_intents)

            return {"status": "Success", "message": "Intent Updated Successfully"}, intents_list
        else:
            return {"status": "Error", "message": "Intent Name already exists"}, None

    async def get_intent_details(self, data):

        json_record = json.loads(json.dumps(data))
        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        result = await db.intents.find_one(query)
        print("Intent Details sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def insert_intent_detail(self, data):

        # Data format - No check for Intent already exists
        # {"object_id":"", "text":"I am in india ","entities":[{"start":8,"end":13,"value":"india","entity":"timezone"}]}

        json_record = json.loads(json.dumps(data))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        object_id = json_record['object_id']
        del json_record['object_id']

        result = await db.intents.update_one(query, {"$push": {"text_entities": json_record}}, upsert=True)
        print("Inserted new row in Intent {}".format(result))

        intent_detail = await self.get_intent_details({"object_id": object_id})
        return {"status": "Success", "message": "Intent text added "}, intent_detail

    async def update_intent_detail(self, data):

        json_record = json.loads(json.dumps(data))

        object_id = json_record['object_id']
        index = json_record['doc_index']
        del json_record['object_id']
        del json_record['doc_index']
        query = {"_id": ObjectId("{}".format(object_id))}
        result = await db.intents.update_one(query, {"$set": {"text_entities."+index: json_record}})
        print("Record updated {}".format(result))

        intent_detail = await self.get_intent_details({"object_id": object_id})
        return {"status": "Success", "message": "Intent Updated successfully"}, intent_detail

    async def delete_intent_detail(self, data):

        # {"object_id": "", "text":"I am in india ","entities":[{"start":8,"end":13,"value":"india","entity":"timezone"}] }

        json_record = json.loads(json.dumps(data))
        object_id = json_record['object_id']
        del json_record['object_id']

        query = {"_id": ObjectId("{}".format(object_id))}

        result = await db.intents.update_one(query, {"$pull": {"text_entities": json_record}})
        print("Removed row from Intent {}".format(result))

        intent_detail = await self.get_intent_details({"object_id": object_id})
        return {"status": "Success", "message": "Intent text Removed "}, intent_detail


# noinspection PyMethodMayBeStatic
class ResponseModel:

    def __init__(self):
        pass

    async def get_responses(self, record):

        json_record = json.loads(json.dumps(record))

        cursor = db.responses.find(json_record, {"project_id": 1, "domain_id": 1, "response_name": 1, "response_description": 1})
        result = await cursor.to_list(length=1000)

        print("Responses sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def create_response(self, record):

        json_record = json.loads(json.dumps(record))

        insert_record = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id'],
                         "response_name": json_record['response_name'],
                         "response_description": json_record['response_description'], "text_entities": []}

        val_res = await db.responses.find_one({"project_id": json_record['project_id'],
                                               "domain_id": json_record['domain_id'],
                                               "response_name": json_record['response_name']})

        if val_res is not None:
            print('Response already exists')
            return {"status": "Error", "message": "Response already exists"}, None
        else:

            result = await db.responses.insert_one(json.loads(json.dumps(insert_record)))
            print("Response created with ID {}".format(result.inserted_id))

            get_responses = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            responses_list = await self.get_responses(get_responses)

            return {"status": "Success", "message": "Response created successfully"}, responses_list

    async def delete_response(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        result = await db.responses.delete_one(query)
        print("Response Deleted count {}".format(result))

        get_responses = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        responses_list = await self.get_responses(get_responses)

        return {"status": "Success", "message": "Response Deleted successfully"}, responses_list

    async def update_response(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"response_name": json_record['response_name'],
                                 "response_description": json_record['response_description']}}

        # Check if Response already exists
        val_res = await db.responses.find_one({"project_id": json_record['project_id'],
                                               "domain_id": json_record['domain_id'],
                                               "response_name": json_record['response_name']})

        if val_res is None or val_res['response_name'] == json_record['response_name']:
            update_record = await db.responses.update_one(query, update_field)

            print("Response Updated , rows modified {}".format(update_record))

            get_responses = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            responses_list = await self.get_responses(get_responses)

            return {"status": "Success", "message": "Response Updated successfully"}, responses_list
        else:
            return {"status": "Error", "message": "Response Name already exists"}, None

    async def get_response_details(self, data):

        json_record = json.loads(json.dumps(data))
        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        result = await db.responses.find_one(query)
        print("Response Details sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def insert_response_detail(self, data):

        json_record = json.loads(json.dumps(data))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        object_id = json_record['object_id']
        del json_record['object_id']

        result = await db.responses.update_one(query, {"$push": {"text_entities": json_record['text_entities']}}, upsert=True)
        print("Inserted new row in Intent {}".format(result))

        intent_detail = await self.get_response_details({"object_id": object_id})
        return {"status": "Success", "message": "Response text added "}, intent_detail

    async def delete_response_detail(self, data):

        # {"object_id": "", "text":"I am in india ","entities":[{"start":8,"end":13,"value":"india","entity":"timezone"}] }

        json_record = json.loads(json.dumps(data))
        object_id = json_record['object_id']
        del json_record['object_id']

        query = {"_id": ObjectId("{}".format(object_id))}

        result = await db.responses.update_one(query, {"$pull": {"text_entities": json_record['text_entities']}})
        print("Removed row from Intent {}".format(result))

        intent_detail = await self.get_response_details({"object_id": object_id})
        return {"status": "Success", "message": "Response text Removed "}, intent_detail


# noinspection PyMethodMayBeStatic
class StoryModel:

    def __init__(self):
        pass

    async def get_stories(self, record):

        json_record = json.loads(json.dumps(record))

        cursor = db.stories.find(json_record, {"project_id": 1, "domain_id": 1, "story_name": 1, "story_description": 1})
        result = await cursor.to_list(length=1000)

        print("Stories sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def create_story(self, record):

        json_record = json.loads(json.dumps(record))

        insert_record = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id'],
                         "story_name": json_record['story_name'],
                         "story_description": json_record['story_description'], "story": []}

        val_res = await db.stories.find_one({"project_id": json_record['project_id'],
                                             "domain_id": json_record['domain_id'],
                                             "story_name": json_record['story_name']})

        if val_res is not None:
            print('Story already exists')
            return {"status": "Error", "message": "Story already exists"}, None

        else:

            result = await db.stories.insert_one(json.loads(json.dumps(insert_record)))
            print("Story created with ID {}".format(result.inserted_id))

            get_stories = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            stories_list = await self.get_stories(get_stories)

            return {"status": "Success", "message": "Story created successfully "}, stories_list

    async def delete_story(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        result = await db.stories.delete_one(query)
        print("Story Deleted count {}".format(result))

        get_stories = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        stories_list = await self.get_stories(get_stories)

        return {"status": "Success", "message": "Story Deleted successfully"}, stories_list

    async def update_story(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"story_name": json_record['story_name'],
                                 "story_description": json_record['story_description']}}

        # Check if Response already exists
        val_res = await db.stories.find_one({"project_id": json_record['project_id'],
                                             "domain_id": json_record['domain_id'],
                                             "story_name": json_record['story_name']})

        if val_res is None or val_res['story_name'] == json_record['story_name']:

            update_record = await db.stories.update_one(query, update_field)
            print("Story Updated , rows modified {}".format(update_record))

            get_stories = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
            stories_list = await self.get_stories(get_stories)
            return {"status": "Success", "message": "Story Updated successfully "}, stories_list

        else:
            return {"status": "Error", "message": "Story Name already exists"}, None

    async def get_only_story_details(self, data):

        json_record = json.loads(json.dumps(data))
        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        result = await db.stories.find_one(query)
        print("Story Details sent {}".format(json.loads(dumps(result))))
        return result

    async def get_story_details(self, data):

        json_record = json.loads(json.dumps(data))
        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        result = await db.stories.find_one(query)
        print("Story Details sent {}".format(json.loads(dumps(result))))

        # TODO  - Verify if this works If intents or responses are created , when user is in Story details page , all intents / responses should be
        #  broadcast to this room as well

        # Get intents

        cursor = db.intents.find({"project_id": json_record['project_id'], "domain_id": json_record['domain_id']})
        result_intents = await cursor.to_list(length=1000)
        intents_list = json.loads(dumps(result_intents))

        # Get Responses

        cursor = db.responses.find({"project_id": json_record['project_id'], "domain_id": json_record['domain_id']})
        result_response = await cursor.to_list(length=1000)
        response_list = json.loads(dumps(result_response))

        return json.loads(dumps(result)), intents_list, response_list

    async def insert_story_details(self, data):

        # {'object_id':"", "position":"", "story": ["key":"abc", "value":"", "type": "intent",
        #                           "entities": [{"entity_name": "test entity", "entity_value": "Test"}]]}

        json_record = json.loads(json.dumps(data))
        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        position = json_record['position']

        result = await db.stories.update_one(query, {"$push": {"story": {"$each": json_record['story'],
                                                                         "$position": position}
                                                               }})

        print("Story Details Updated {}".format(result))

        story_details, intents_list, response_list = await self.get_story_details({"object_id": json_record['object_id'],
                                                                                   "project_id": json_record['project_id'],
                                                                                   "domain_id": json_record['domain_id']})

        return {"status": "Success", "message": "Story created"}, story_details, intents_list, response_list

    async def delete_story_detail(self, data):

        # {"object_id": "", "text":"I am in india ","story":[{"start":8,"end":13,"value":"india","entity":"timezone"}] }

        json_record = json.loads(json.dumps(data))
        object_id = json_record['object_id']

        query = {"_id": ObjectId("{}".format(object_id))}

        result = await db.stories.update_one(query, {"$pull": {"story": json_record['story'][0]}})
        print("Removed row from Story {}".format(result))

        story_detail,  intents_list, response_list = await self.get_story_details({"object_id": json_record['object_id'],
                                                                                   "project_id": json_record['project_id'],
                                                                                   "domain_id": json_record['domain_id']})
        return {"status": "Success", "message": "Story element Removed "}, story_detail, intents_list, response_list

    async def update_story_detail(self, data):

        json_record = json.loads(json.dumps(data))

        object_id = json_record['object_id']
        index = json_record['doc_index']
        query = {"_id": ObjectId("{}".format(object_id))}
        result = await db.stories.update_one(query, {"$set": {"story."+str(index): json_record['story']}})
        print("Record updated {}".format(result))

        story_detail,  intents_list, response_list = await self.get_story_details({"object_id": json_record['object_id'],
                                                                                   "project_id": json_record['project_id'],
                                                                                   "domain_id": json_record['domain_id']})
        return {"status": "Success", "message": "Story Updated successfully"}, story_detail, intents_list, response_list


# noinspection PyMethodMayBeStatic
class EntityModel:

    def __init__(self):
        pass

    async def get_entities(self, record):

        json_record = json.loads(json.dumps(record))
        cursor = db.entities.find(json_record)
        result = await cursor.to_list(length=1000)
        print("Entities sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def create_entity(self, record):

        json_record = json.loads(json.dumps(record))

        # Check if Entity already exists
        val_res = await db.entities.find_one({"project_id": json_record['project_id'],
                                              "entity_name": json_record['entity_name']})

        if val_res is not None:
            print("Entity Already exists ")
            return {"status": "Error", "message": "Entity Already exists "}, None
        else:
            result = await db.entities.insert_one(json_record)
            print("Entity created with ID {}".format(result.inserted_id))

            get_entities = {"project_id": json_record['project_id']}
            entities_list = await self.get_entities(get_entities)

            return {"status": "Success", "message": "Entity created successfully"}, entities_list

    async def delete_entity(self, record):

        json_record = json.loads(json.dumps(record))

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        result = await db.entities.delete_one(query)
        print("Entity Deleted count {}".format(result))

        get_entities = {"project_id": json_record['project_id']}
        entities_list = await self.get_entities(get_entities)

        return {"status": "Success", "message": "Entity deleted successfully"}, entities_list

    async def update_entity(self, record):

        json_record = json.loads(json.dumps(record))

        # Check if Entity already exists
        val_res = await db.entities.find_one({"project_id": json_record['project_id'],
                                              "entity_name": json_record['entity_name']})

        object_id = val_res.get('_id')
        query = {"_id": ObjectId("{}".format(object_id))}

        if val_res is None or val_res['entity_name'] == json_record['entity_name']:
            del json_record['_id']
            print("Got value ", json_record)
            update_record = await db.entities.update_one(query, {"$set": json_record})
            print("Entity Updated , rows modified {}".format(update_record.modified_count))

            get_entities = {"project_id": json_record['project_id']}
            entities_list = await self.get_entities(get_entities)
            return {"status": "Success", "message": "Entity updated successfully"}, entities_list

        else:
            return {"status": "Error", "message": "Entity Name already exists"}, None
