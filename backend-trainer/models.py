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


class projectsModel():

    async def getProjects():
        cursor= db.projects.find()
        result=await cursor.to_list(length=1000)
        print("Projects sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def createProjects(record):
        result=await db.projects.insert_one(json.loads(record))
        print("project created {}".format(result.inserted_id))
        return result.inserted_id

    async def deleteProject(object_id):
        query = {"_id": ObjectId("{}".format(object_id))}
        result=db.projects.delete_one(query)
        print("Project Deleted count {}".format(result))
        return result

    async def updateProject(record):

        json_record = json.loads(record)

        query = {"_id": ObjectId("{}".format(json_record['object_id']))}
        update_field = {"$set": {"project_id": json_record['project_id'], "project_name": json_record['project_name'],
                                 "project_description": json_record['project_description']}}
        result = db.projects.update_one(query,update_field)
        print("Project Updated , rows modified {}".format(result))
        return result


class domainsModel():

    async def getDomains(project_id):
        query = {"project_id": project_id}
        cursor = db.domains.find(query)
        result = await cursor.to_list(length=1000)
        print("Domains sent {}".format(json.loads(dumps(result))))
        return json.loads(dumps(result))

    async def createDomain(data):

        record = {"project_id":data['project_id'],"domain_id":data['domain_id'],"domain_name":data['domain_name'],"domain_description":data['domain_description'],
                  "domain":{"Intents":[{}],"Stories":[{}],"Responses":[{}]}}
        result = db.domains.insert_one(json.loads(record))
        print("Domain created with ID {}".format(result.inserted_id))
        return result.inserted_id