import os
import sys

# Add the project root to the Python path to allow importing from the services module
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from services.db_service import initialize_database

if __name__ == "__main__":
    initialize_database()
    print("Database initialized successfully")
