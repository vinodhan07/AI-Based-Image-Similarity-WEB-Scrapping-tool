import os
import sys
import sqlite3
import faiss
import numpy as np

# Add project root to python path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from embedding.generate_embeddings import EmbeddingGenerator

DB_PATH = os.path.join(PROJECT_ROOT, 'data', 'sqlite_db', 'metadata.db')
FAISS_INDEX_PATH = os.path.join(PROJECT_ROOT, 'vector_index', 'faiss.index')

def build_and_update_index():
    """
    1. Loads images from SQLite that have not yet been indexed.
    2. Generates OpenCLIP embeddings for them.
    3. Adds embeddings to the FAISS index (mapped via ID).
    4. Marks them as indexed = 1 in the SQLite database.
    5. Saves the updated index file.
    """
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}. Run init_db.py and seed_db.py first.")
        return

    # 1. Connect to Database and Fetch Unindexed Images
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, file_path FROM images WHERE indexed = 0")
    unindexed_images = cursor.fetchall()

    if not unindexed_images:
        print("No new images to index. Database is fully synced.")
        conn.close()
        return

    print(f"Found {len(unindexed_images)} new images to index.")

    # 2. Init Embedding Generator
    generator = EmbeddingGenerator()

    # 3. Initialize or Load FAISS Index
    # We use IndexIDMap to allow us to map arbitrary SQLite IDs directly to FAISS vectors.
    # IndexFlatIP is used because our OpenCLIP embeddings are already L2 normalized,
    # meaning Inner Product (IP) is equivalent to Cosine Similarity.
    os.makedirs(os.path.dirname(FAISS_INDEX_PATH), exist_ok=True)
    
    dim = generator.embedding_dim
    
    if os.path.exists(FAISS_INDEX_PATH):
        print(f"Loading existing FAISS index from {FAISS_INDEX_PATH}...")
        faiss_index = faiss.read_index(FAISS_INDEX_PATH)
    else:
        print(f"Creating new FAISS index (Dimension: {dim})...")
        base_index = faiss.IndexFlatIP(dim)
        faiss_index = faiss.IndexIDMap(base_index)

    success_count = 0
    fail_count = 0

    # 4. Generate & Store Embeddings
    for image_id, file_path in unindexed_images:
        
        # Guard check if file exists
        if not os.path.exists(file_path):
            print(f"Warning: Image file not found: {file_path}")
            fail_count += 1
            continue

        embedding = generator.generate_embedding(file_path)
        if embedding is None:
            fail_count += 1
            continue
        
        # FAISS expects 2D array: (1, dim) for a single vector
        vector = np.array([embedding], dtype=np.float32)
        idx_array = np.array([image_id], dtype=np.int64)

        # Add to index mapping vector to SQLite ID
        faiss_index.add_with_ids(vector, idx_array)
        
        # 5. Update Database Record
        try:
            cursor.execute("UPDATE images SET indexed = 1 WHERE id = ?", (image_id,))
            conn.commit()
            success_count += 1
            print(f"Indexed Image ID {image_id}")
        except sqlite3.Error as e:
            print(f"Failed to update index status for Image ID {image_id}: {e}")
            fail_count += 1

    # 6. Save FAISS Index
    if success_count > 0:
        faiss.write_index(faiss_index, FAISS_INDEX_PATH)
        print(f"\nSaved updated FAISS index to {FAISS_INDEX_PATH}")
    
    conn.close()
    
    print("--- Indexing Summary ---")
    print(f"Successfully Indexed: {success_count}")
    print(f"Failed or Skipped: {fail_count}")

if __name__ == "__main__":
    build_and_update_index()
