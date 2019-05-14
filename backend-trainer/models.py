from motor.motor_asyncio import AsyncIOMotorClient
from bson.json_util import dumps
import json
from bson.objectid import ObjectId

# motor MongoDb connection

client = AsyncIOMotorClient('mongodb://localhost:27017')
db = client['eva_platform']

class dbname():

    async def getName():
        db= client['eva_platform']
        result= await db.projects.find_one({"project_id":2})
        return json.loads(dumps(result))


class refreshDB():

    async def refreshdb():
        print('received request to refresh database')
        return "Success"


class projectsModel():

    async def getProjects():
        cursor= db.projects.find()
        result=await cursor.to_list(length=1000)
        print("Projects sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def createProjects(record):

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

    async def deleteProject(object_id):
        query = {"_id": ObjectId("{}".format(object_id))}

        ''' 
        TODO 
        Need to add Validation section - Need to remove all dependencies 
        from this project before deleting the project'''

        result=db.projects.delete_one(query)
        print("Project Deleted count {}".format(result))
        return {"status": "Success", "message": "Project Deleted Successfully"}

    async def updateProject(record):

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
            result = db.projects.update_one(query,update_field)
            print("Project Updated , rows modified {}".format(result))
            return {"status": "Success", "message": "Project details updated successfully"}

    async def copyProject(record):
        json_record = json.loads(json.dumps(record))

        # check if the project name exists

        val_res = await db.projects.find_one({"project_name": json_record['project_name']})

        if val_res is not None:
            print('Project already exists')
            return {"status": "Error", "message": "Project already exists"}
        else:

            # Create Project

            result = await db.projects.insert_one(json_record)
            print("project created {}".format(result.inserted_id))

            # Copy Domains Intents Entities etc TODO

            return {"status": "Success", "message": "Project Copied ID {}".format(result.inserted_id)}



class domainsModel():

    async def getDomains(project_id):
        query = {"project_id": project_id}
        cursor = db.domains.find(query)
        result = await cursor.to_list(length=1000)
        print("Domains sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def createDomain(record):

        json_record = json.loads(record)

        insert_record = {"project_id":json_record['project_id'],"domain_id":json_record['domain_id'],"domain_name":json_record['domain_name'],"domain_description":json_record['domain_description'],
                  "domain":{"Intents":[{}],"Stories":[{}],"Responses":[{}]}}

        insert_result = await db.domains.insert_one(json.loads(insert_record))
        print("Domain created with ID {}".format(result.inserted_id))

        domains_list = await getDomains(json_record['project_id'])

        return insert_result.inserted_id, domains_list

    async def deleteDomain(record):

        json_record = json.loads(record)

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        delete_record = await db.domains.delete_one(query)
        print("Domain Deleted count {}".format(result))

        domains_list = await getDomains(json_record['project_id'])

        return delete_record, domains_list

    async def updateDomain(record):

        json_record = json.loads(record)

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"domain_id": json_record['domain_id'], "domain_name": json_record['domain_name'],
                                 "domain_description": json_record['domain_description']}}
        update_record = await db.domains.update_one(query, update_field)

        print("Domain Updated , rows modified {}".format(update_record))

        domains_list = await getDomains(json_record['project_id'])

        return update_record, domains_list


class intentsModel():

    async def getIntents(record):

        json_record = json.loads(record)

        cursor = db.intents.find(json_record)
        result = await cursor.to_list(length=1000)

        print("Intents sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def createIntent(record):

        json_record = json.loads(record)

        insert_record = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id'],
                         "intent_id": json_record['intent_id'], "intent_name": json_record['intent_name'],
                         "intent_description": json_record['intent_description'], "text_entities": [""]}

        result = await db.intents.insert_one(json.loads(insert_record))
        print("Intent created with ID {}".format(result.inserted_id))

        get_intents = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        intents_list = await getIntents(get_intents)

        return result.inserted_id, intents_list

    async def deleteIntent(record):

        json_record = json.loads(record)

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        result = await db.intents.delete_one(query)
        print("Intent Deleted count {}".format(result))

        get_intents = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        intents_list = await getIntents(get_intents)

        return result, intents_list

    async def updateIntent(record):

        json_record = json.load(record)

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"intent_id": json_record['intent_id'], "intent_name": json_record['intent_name'],
                                 "intent_description": json_record['intent_description']}}
        update_record = await db.intents.update_one(query, update_field)

        print("Intent Updated , rows modified {}".format(update_record))

        get_intents = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        intents_list = await getIntents(get_intents)

        return update_record, intents_list


class responsesModel():

    async def getResponses(record):

        json_record = json.load(record)

        cursor = db.responses.find(json_record)
        result = await cursor.to_list(length=1000)

        print("Responses sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))


    async def createResponse(record):

        json_record = json.load(record)

        insert_record = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id'],
                         "response_id": json_record['response_id'], "response_name": json_record['response_name'],
                         "response_description": json_record['response_description'], "text_entities": [""]}

        result = await db.responses.insert_one(json.loads(insert_record))
        print("Response created with ID {}".format(result.inserted_id))

        get_responses = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        responses_list = await getResponses(get_responses)

        return result, responses_list

    async def deleteResponse(record):

        json_record = json.loads(record)

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        result = await db.responses.delete_one(query)
        print("Response Deleted count {}".format(result))

        get_responses = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        responses_list = await getResponses(get_responses)

        return result, responses_list

    async def updateResponse(record):

        json_record = json.load(record)

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"response_id": json_record['response_id'], "response_name": json_record['response_name'],
                                 "response_description": json_record['response_description']}}
        update_record = await db.responses.update_one(query, update_field)

        print("Intent Updated , rows modified {}".format(update_record))

        get_responses = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        responses_list = await getResponses(get_responses)

        return update_record, responses_list


class storyModel():

    async def getStories(record):

        json_record = json.load(record)

        cursor = db.stories.find(json_record)
        result = await cursor.to_list(length=1000)

        print("Stories sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def createStory(record):

        json_record = json.load(record)

        insert_record = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id'],
                         "story_id": json_record['story_id'], "story_name": json_record['story_name'],
                         "story_description": json_record['story_description'], "intents_responses": [""]}

        result = await db.stories.insert_one(json.loads(insert_record))
        print("Story created with ID {}".format(result.inserted_id))

        get_stories = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        stories_list = await getStories(get_stories)

        return result, stories_list

    async def deleteStory(record):

        json_record = json.loads(record)

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}

        result = await db.stories.delete_one(query)
        print("Story Deleted count {}".format(result))

        get_stories = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        stories_list = await getStories(get_stories)

        return result, stories_list

    async def updateStory(self):

        json_record = json.load(record)

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"story_id": json_record['story_id'], "story_name": json_record['story_name'],
                                 "story_description": json_record['story_description']}}
        update_record = await db.stories.update_one(query, update_field)

        print("Story Updated , rows modified {}".format(update_record))

        get_stories = {"project_id": json_record['project_id'], "domain_id": json_record['domain_id']}
        stories_list = await getStories(get_stories)

        return update_record, stories_list


class entityModel():

    async def getEntities(record):

        json_record = json.load(record)

        cursor = db.entities.find(json_record)
        result = await cursor.to_list(length=1000)

        print("Entities sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))