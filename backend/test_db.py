import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

MONGO_URL = "mongodb+srv://Harsha_96:Sanji_9605@cluster0.bfcuzb2.mongodb.net/?appName=Cluster0"

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
