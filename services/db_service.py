import sqlite3
import os

# Define the absolute path to the database file dynamically based on the project root
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(PROJECT_ROOT, 'data', 'sqlite_db', 'metadata.db')

def initialize_database():
    """
    Initialize the SQLite database and create the images table if it does not exist.
    """
    # Ensure the directory exists
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    # Connect to the database (creates it if it doesn't exist)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create the main table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_path TEXT NOT NULL,
        source_url TEXT,
        hash TEXT UNIQUE,
        indexed INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()
