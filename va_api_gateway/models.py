from pymongo import MongoClient
import os
import json
from bson.json_util import dumps
from bson.objectid import ObjectId


try:
    client = MongoClient(os.environ['MONGODB_HOST'], os.environ['MONGODB_PORT'])
except KeyError:
    client = MongoClient('localhost', 27017)


db = client.eva_platform


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
