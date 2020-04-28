from motor.motor_asyncio import AsyncIOMotorClient
from config import CONFIG
import os


# noinspection PyMethodMayBeStatic
class ConDatabase:

    def connect():
        #client = AsyncIOMotorClient(CONFIG.get('api_gateway', 'MONGODB_URL'))
        #db = client[CONFIG.get('api_gateway', 'MONGODB_NAME')]
        client = AsyncIOMotorClient(os.environ["MONGODB_URL"])
        db = client[os.environ["MONGODB_NAME"]]
        return db
