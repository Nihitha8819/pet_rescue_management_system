import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petrescue_backend.settings')
django.setup()

from django.conf import settings

print("Testing MongoDB Connection...")
print(f"MONGO_URI: {settings.MONGO_URI}")
print(f"MONGO_DB_NAME: {settings.MONGO_DB_NAME}")

try:
    from pymongo import MongoClient
    import urllib.parse  # Connect to MongoDB
    client = MongoClient(settings.MONGO_URI)
    
    # Test the connection
    client.admin.command('ping')
    
    # Get database
    db = client[settings.MONGO_DB_NAME]
    
    print("✓ Successfully connected to MongoDB Atlas!")
    print(f"✓ Server version: {client.server_info()['version']}")
    print(f"✓ Database: {db.name}")
    
    # List collections (might be empty if new database)
    collections = db.list_collection_names()
    print(f"✓ Collections ({len(collections)}): {collections}")
    
except Exception as e:
    print(f"✗ Connection failed: {type(e).__name__}: {e}")
    print("\nTroubleshooting tips:")
    print("1. Check if your IP is whitelisted in MongoDB Atlas")
    print("2. Verify your username and password")
    print("3. Check internet connection")
    print("4. Make sure the database name exists in Atlas")
