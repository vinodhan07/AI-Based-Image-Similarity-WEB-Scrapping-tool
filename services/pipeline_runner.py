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

def run_indexing_pipeline():
    """
    Controller function to handle loading unindexed images, 
    generating CLIP embeddings, updating the FAISS index, 
    and marking images as indexed in SQLite.
    """
    # STEP 6 Logs 
    print("Loading images...")
    
    if not os.path.exists(DB_PATH):
        print("Database not found at data/sqlite_db/metadata.db")
        return
        
    # STEP 1: Connect to SQLite database.
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # STEP 2: Fetch all images that are NOT indexed
    cursor.execute("SELECT id, file_path FROM images WHERE indexed = 0;")
    unindexed_images = cursor.fetchall()
    
    if not unindexed_images:
        print("No new images to index.")
        print("Pipeline completed successfully")
        conn.close()
        return
        
    # STEP 6 Logs
    print("Generating embeddings...")
    generator = EmbeddingGenerator()
    dim = generator.embedding_dim
    
    os.makedirs(os.path.dirname(FAISS_INDEX_PATH), exist_ok=True)
    
    # Initialize FAISS Index (IndexFlatIP for Cosine Similarity since embeddings are L2 normalized)
    if os.path.exists(FAISS_INDEX_PATH):
        faiss_index = faiss.read_index(FAISS_INDEX_PATH)
    else:
        base_index = faiss.IndexFlatIP(dim)
        faiss_index = faiss.IndexIDMap(base_index)
        
    # STEP 6 Logs
    print("Building FAISS index...")
    
    # STEP 3: For each image load, embed, add to FAISS
    for image_id, file_path in unindexed_images:
        if not os.path.exists(file_path):
            print(f"Warning: Missing file at {file_path}")
            continue
            
        embedding = generator.generate_embedding(file_path)
        if embedding is None:
            continue
            
        vector = np.array([embedding], dtype=np.float32)
        idx_array = np.array([image_id], dtype=np.int64)
        
        faiss_index.add_with_ids(vector, idx_array)
        
        # STEP 4: Update database
        try:
            cursor.execute("UPDATE images SET indexed = 1 WHERE id = ?", (image_id,))
            conn.commit()
        except sqlite3.Error as e:
            print(f"Error updating DB for image {image_id}: {e}")
            
    # STEP 5: Save FAISS index
    faiss.write_index(faiss_index, FAISS_INDEX_PATH)
    
    conn.close()
    
    # STEP 6: Print final log
    print("Pipeline completed successfully")

if __name__ == "__main__":
    run_indexing_pipeline()
