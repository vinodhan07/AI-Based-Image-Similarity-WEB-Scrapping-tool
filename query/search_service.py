import os
import sys
import sqlite3
import faiss
import numpy as np
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(name)s - %(message)s')
logger = logging.getLogger("search_service")

# Add project root to python path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from embedding.generate_embeddings import EmbeddingGenerator

DB_PATH = os.path.join(PROJECT_ROOT, 'data', 'sqlite_db', 'metadata.db')
FAISS_INDEX_PATH = os.path.join(PROJECT_ROOT, 'vector_index', 'faiss.index')

# Initialize generator once. In a real prod environment this would be singleton/cached.
# We'll instantiate it lazily here to avoid loading CUDA if this module is just imported.
_generator = None

def get_generator():
    global _generator
    if _generator is None:
        _generator = EmbeddingGenerator()
    return _generator

def search_image(image_input, threshold=0.78):
    """
    Takes an uploaded image (PIL Image or file path), generates OpenCLIP embedding,
    searches the FAISS index for the 5 nearest neighbors, applies the threshold,
    and returns a structured JSON-like dict with SAFE or FOUND status.
    """
    logger.info("Received user image")
    
    # 1. Load FAISS index
    if not os.path.exists(FAISS_INDEX_PATH):
        logger.error(f"FAISS index file not found at {FAISS_INDEX_PATH}")
        raise FileNotFoundError(f"faiss.index file does not exist at {FAISS_INDEX_PATH}")
        
    logger.info("Loading FAISS index...")
    t0 = time.time()
    faiss_index = faiss.read_index(FAISS_INDEX_PATH)
    t_load = time.time() - t0
    
    logger.info("FAISS index loaded successfully")
    print("Total vectors in FAISS:", faiss_index.ntotal)
    logger.info(f"Time to load FAISS: {t_load:.4f}s")
    
    if faiss_index.ntotal == 0:
        logger.warning("FAISS index is empty.")
        logger.info("Search completed")
        return {"status": "SAFE"}
        
    # 2 & 3. Accept User Image & Generate Query Embedding
    logger.info("Generating CLIP embedding...")
    t1 = time.time()
    generator = get_generator()
    embedding = generator.generate_embedding(image_input)
    t_embed = time.time() - t1
    logger.info(f"Time to generate embedding: {t_embed:.4f}s")
    
    if embedding is None:
        logger.error("Failed to generate embedding.")
        raise ValueError("Failed to generate embedding for the uploaded image")
        
    logger.info(f"Embedding vector shape: [{len(embedding)}]")
    
    if len(embedding) != faiss_index.d:
        error_msg = f"Embedding dimension ({len(embedding)}) != FAISS dimension ({faiss_index.d})"
        logger.error(error_msg)
        raise ValueError(error_msg)
        
    query_vector = np.array([embedding], dtype=np.float32)
    
    # 4. Perform Similarity Search
    logger.info("Performing FAISS search...")
    t2 = time.time()
    
    # Increase Search Neighbors from k=1 to k=5
    # For IndexFlatIP, distances are dot products descending (higher = more similar)
    k = min(5, faiss_index.ntotal)
    distances, indices = faiss_index.search(query_vector, k=k)
    t_search = time.time() - t2
    logger.info(f"Time to search: {t_search:.4f}s")
    
    # distances[0][0] is the inner product (cosine similarity) since vectors are L2 normalized.
    # The first result (index 0) is the best match for IndexFlatIP (descending order).
    best_score = float(distances[0][0])
    best_id = int(indices[0][0])
    
    logger.info(f"Search result ID returned: {best_id}")
    logger.info(f"Distance value: {best_score}")
    print("Similarity score:", best_score)
    
    # 5. Apply Threshold Logic
    if best_score >= threshold:
        # 6. Fetch Metadata
        logger.info("Fetching metadata from SQLite...")
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT source_url, file_path FROM images WHERE id = ?", (best_id,))
            row = cursor.fetchone()
            conn.close()
            
            source_url = row[0] if row else "Unknown Source"
            file_path = row[1] if row else None
            
            logger.info(f"Matched file_path: {file_path}")
            logger.info("Search completed")
            # 7. Return Final Result (FOUND)
            return {
                "status": "FOUND",
                "similarity": round(best_score, 4),
                "source_url": source_url,
                "file_path": file_path
            }
        except Exception as e:
            print(f"Error fetching metadata for ID {best_id}: {e}")
            logger.info("Search completed")
            return {"status": "SAFE"}
            
    # 7. Return Final Result (SAFE)
    logger.info("Search completed")
    return {
        "status": "SAFE"
    }
