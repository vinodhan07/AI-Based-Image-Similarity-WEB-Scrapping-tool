import os
import sys
import sqlite3
import hashlib

# Add the project root to the Python path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

DB_PATH = os.path.join(PROJECT_ROOT, 'data', 'sqlite_db', 'metadata.db')
RAW_IMAGES_DIR = os.path.join(PROJECT_ROOT, 'data', 'raw_images')

def generate_file_hash(filepath):
    """
    Generate SHA-256 hash from the binary contents of the image file.
    """
    sha256_hash = hashlib.sha256()
    try:
        with open(filepath, "rb") as f:
            # Read and update hash string value in blocks of 4K
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
        return None

def seed_database():
    """
    Scans the raw_images directory, computes hashes, and inserts metadata into SQLite.
    """
    if not os.path.exists(DB_PATH):
        print(f"Error: Database not found at {DB_PATH}. Please run init_db.py first.")
        return

    if not os.path.exists(RAW_IMAGES_DIR):
        print(f"Directory {RAW_IMAGES_DIR} does not exist. Creating it now.")
        os.makedirs(RAW_IMAGES_DIR, exist_ok=True)
        print("Please place images in data/raw_images/ and run this script again.")
        return

    # Valid image extensions
    valid_extensions = {'.png', '.jpg', '.jpeg', '.webp'}
    
    # Social media platforms for mock URLs
    import random
    platforms = [
        "instagram.com/p",
        "twitter.com/status",
        "reddit.com/r/pics/comments",
        "facebook.com/photo.php?fbid",
        "pinterest.com/pin"
    ]

    # 1. Connect to Database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    inserted_count = 0
    skipped_count = 0

    print("Scanning data/raw_images/ for images...")

    # 2. Read Images
    for filename in os.listdir(RAW_IMAGES_DIR):
        filepath = os.path.join(RAW_IMAGES_DIR, filename)
        
        if os.path.isfile(filepath):
            ex = os.path.splitext(filename)[1].lower()
            if ex in valid_extensions:
                
                # 3. Generate Metadata (Hash from bytes)
                file_hash = generate_file_hash(filepath)
                if not file_hash:
                    continue
                
                # Normalize the filepath using forward slashes for cross-platform DB consistency
                db_filepath = filepath.replace('\\', '/')
                
                # Generate a random social media source URL
                platform = random.choice(platforms)
                random_id = ''.join(random.choices('0123456789abcdefghijklmnopqrstuvwxyz', k=10))
                source_url = f"https://www.{platform}/{random_id}"
                
                # 4. Insert into SQLite (Skip duplicates using INSERT OR IGNORE)
                try:
                    cursor.execute('''
                        INSERT OR IGNORE INTO images (file_path, source_url, hash, indexed)
                        VALUES (?, ?, ?, 0)
                    ''', (db_filepath, source_url, file_hash))
                    
                    if cursor.rowcount > 0:
                        inserted_count += 1
                        print(f"Inserted: {filename}")
                    else:
                        skipped_count += 1
                        print(f"Skipped (Duplicate): {filename}")
                except sqlite3.Error as e:
                    print(f"Database error on {filename}: {e}")

    # 5. Finalize
    conn.commit()
    conn.close()
    
    print(f"\nSeeding finished. Inserted: {inserted_count}, Skipped: {skipped_count}")
    print("Metadata seeding completed successfully")

if __name__ == "__main__":
    seed_database()
