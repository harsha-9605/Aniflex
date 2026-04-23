import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

async def test_conn():
    try:
        client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000, tlsCAFile=certifi.where())
        await client.admin.command('ping')
        print("Connected successfully!")
    except Exception as e:
        with open("error.log", "w", encoding="utf-8") as f:
            f.write(repr(e))
        print("Error written to error.log")

asyncio.run(test_conn())
