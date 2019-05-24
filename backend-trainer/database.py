from motor.motor_asyncio import AsyncIOMotorClient


# noinspection PyMethodMayBeStatic
class ConDatabase:

    def connect():
        client = AsyncIOMotorClient('mongodb://localhost:27017')
        db = client['eva_platform']
        return db
