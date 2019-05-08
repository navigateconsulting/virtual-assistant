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
        return json.loads(dumps(result))

    async def createProjects(record):
        result=await db.projects.insert_one(json.loads(record))
        print("project created {}".format(result.inserted_id))
        return result.inserted_id

    async def deleteProject(object_id):
        query = {"_id": ObjectId("{}".format(object_id))}
        result=db.projects.delete_one(query)
        print("Project Deleted count {}".format(result.deleted_count))
        return result.deleted_count

    async def updateProject(record):
        query = {"_id": ObjectId("{}".format(record['object_id']))}
        update_field = {"$set": {"project_id": record['project_id'], "project_name": record['project_name'],
                                 "project_description": record['project_description']}}
        result = db.projects.update_one(query,update_field)
        print("Project Updated , rows modified {}".format(result.modified_count))
        return result.modified_count

