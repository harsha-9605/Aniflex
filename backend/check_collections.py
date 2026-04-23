import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

async def main():
    client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
    db = client.anime_db
    collections = await db.list_collection_names()
    print("Collections:", collections)
    
    if "users" in collections:
        users = await db.users.find({}).to_list(10)
        print("Users:", users)

asyncio.run(main())
