import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

MONGO_URL = "mongodb+srv://Harsha_96:Sanji_9605@cluster0.bfcuzb2.mongodb.net/?appName=Cluster0"

async def main():
    client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
    db = client.anime_db
    collections = await db.list_collection_names()
    print("Collections:", collections)
    
    if "users" in collections:
        users = await db.users.find({}).to_list(10)
        print("Users:", users)

asyncio.run(main())
