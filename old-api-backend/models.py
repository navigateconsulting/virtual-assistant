from run import mongo
from passlib.hash import pbkdf2_sha256 as sha256
import json
import pymongo

class UserModel():

    def create_user(self, userdata):
        # Create new  user
        result = mongo.db.users.insert_one(userdata)
        return result.inserted_id

    def find_by_user(self, username):

        new_res = mongo.db.users.find_one({"username": username})

        if new_res == None:
            return None
        else:
            return new_res

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

class RevokedTokensModel():

    def is_jti_blacklisted(jti):
        result=mongo.db.revoked_tokens.find_one({"token": jti})
        return result

    def add_revoked_token( jti):
        result = mongo.db.revoked_tokens.insert_one({"token_id": 1 , "token": jti})

        if result:
            return False
        else:
            return True

class RefreshSeedData():

    def load_seed_data():

        with open('projects.json') as json_file:
            projects_data = json.load(json_file)

        with open('domain.json') as json_file:
            domain_data = json.load(json_file)

        with open('intents.json') as json_file:
            intents_data = json.load(json_file)

        with open('entities.json') as json_file:
            entities_data = json.load(json_file)

        with open('responses.json') as json_file:
            responses_data = json.load(json_file)

        with open('stories.json') as json_file:
            stories_data = json.load(json_file)

        with open('users.json') as json_file:
            users_data = json.load(json_file)

        with open('revokedtokens.json') as json_file:
            revoked_tokens = json.load(json_file)

        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        dblist = myclient.list_database_names()

        if 'eva_platform' in dblist:

            mongo.db.projects.delete_many({})
            mongo.db.domains.delete_many({})
            mongo.db.intents.delete_many({})
            mongo.db.entities.delete_many({})
            mongo.db.responses.delete_many({})
            mongo.db.stories.delete_many({})
            mongo.db.users.delete_many({})
            mongo.db.revoked_tokens.delete_many({})

            mongo.db.revoked_tokens.insert_many(revoked_tokens)
            mongo.db.projects.insert_many(projects_data)
            mongo.db.domains.insert_many(domain_data)
            mongo.db.intents.insert_many(intents_data)
            mongo.db.entities.insert_many(entities_data)
            mongo.db.responses.insert_many(responses_data)
            mongo.db.stories.insert_many(stories_data)
            mongo.db.users.insert_many(users_data)

        else:
            mongo.db.projects.insert_many(projects_data)
            mongo.db.domains.insert_many(domain_data)
            mongo.db.intents.insert_many(intents_data)
            mongo.db.entities.insert_many(entities_data)
            mongo.db.responses.insert_many(responses_data)
            mongo.db.stories.insert_many(stories_data)
            mongo.db.users.insert_many(users_data)
            mongo.db.revoked_tokens.insert_many(revoked_tokens)

        return {"message": "Application Data base refreshed with seed Data"}

class RasaModel():

    def getProjects():
        result = list(mongo.db.projects.find())
        return result

    def updateprojects(query, update_field):
        result= mongo.db.projects.update_one(query, update_field)
        return result.modified_count

    def deleteprojects(query):
        result=mongo.db.projects.delete_one(query)
        return result.deleted_count

    def createproject(record):
        result=mongo.db.projects.insert_one(record)
        return result.inserted_id

    def getdomain(query):
        print(query)
        result= list(mongo.db.domains.find(query))
        return result

    def createdomain():
        return "test"

    def updatedomain(query, update_field):
        result = mongo.db.domains.update_one(query, update_field)
        return result.modified_count

    def deletedomain():
        return "test"

