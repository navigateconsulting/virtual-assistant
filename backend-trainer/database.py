from motor.motor_asyncio import AsyncIOMotorClient
from config import CONFIG


# noinspection PyMethodMayBeStatic
class ConDatabase:

    def connect():
        client = AsyncIOMotorClient(CONFIG.get('backend-trainer', 'MONGODB_URL'))
        db = client[CONFIG.get('backend-trainer', 'MONGODB_NAME')]
        return db
