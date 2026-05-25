# test_mongo.py
import certifi
from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://kartikeysharma684_db_user:Ru8NyFFkpww9HoYt@cluster0.60u7frp.mongodb.net/?appName=Cluster0",
    tls=True,
    tlsCAFile=certifi.where()
)

print(client.list_database_names())