import os
from fastapi import FastAPI, Body, HTTPException
from pydantic import BaseModel
import bcrypt
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="Animeflex API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MONGODB CONNECTION ---
import certifi

MONGO_URL = "mongodb+srv://Harsha_96:Sanji_9605@cluster0.bfcuzb2.mongodb.net/?appName=Cluster0"

client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
db = client.anime_db  # Database name
collection = db.watchlist  # Table (Collection) name
users_collection = db.users

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

class UserAuth(BaseModel):
    email: str
    password: str
    name: str = None

@app.post("/auth/signup")
async def signup(user: UserAuth):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = {"email": user.email, "password": hashed_password, "name": user.name or "User"}
    await users_collection.insert_one(user_dict)
    
    return {"status": "success", "user": {"email": user.email, "name": user.name or "User"}}

@app.post("/auth/login")
async def login(user: UserAuth):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return {"status": "success", "user": {"email": db_user["email"], "name": db_user.get("name", "User")}}

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Animeflex Cloud API"}

@app.get("/library")
async def get_library(user_id: str = None):
    # Fetch all liked/watched anime from MongoDB
    query = {"user_id": user_id} if user_id else {}
    cursor = collection.find(query)
    library = {}
    async for document in cursor:
        # Convert the MongoDB ID to a string for the frontend
        anime_id = str(document.get("mal_id"))
        document.pop("_id", None) # Remove internal MongoDB ID
        library[anime_id] = document
    return library

@app.post("/library/{anime_id}")
async def update_library(anime_id: str, user_id: str = None, item: dict = Body(...)):
    is_liked = item.get("isLiked", False)
    category = item.get("category")

    query = {"mal_id": int(anime_id)}
    if user_id: 
        query["user_id"] = user_id

    # If the user is removing it entirely
    if not is_liked and not category:
        await collection.delete_one(query)
        return {"status": "success", "message": "Deleted from Cloud"}
    
    # Otherwise, update or create the entry (Upsert)
    else:
        anime_info = item.get("anime", {})
        
        # Safely extract image_url whether it's the Jikan nested format or already flat
        images_dict = anime_info.get("images", {})
        image_url = None
        if isinstance(images_dict, dict):
            image_url = images_dict.get("jpg", {}).get("image_url")
        if not image_url:
            image_url = anime_info.get("image_url")

        clean_data = {
            "mal_id": int(anime_id),
            "user_id": user_id,
            "title": anime_info.get("title_english") or anime_info.get("title"),
            "image_url": image_url,
            "score": anime_info.get("score"),
            "isLiked": is_liked,
            "category": category
        }
        
        # This one command replaces the manual JSON writing!
        await collection.update_one(
            query,
            {"$set": clean_data},
            upsert=True
        )
        return {"status": "success", "message": "Synced to MongoDB Atlas"}