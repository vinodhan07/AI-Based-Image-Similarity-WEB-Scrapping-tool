from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pipeline_runner import run_indexing_pipeline
from query.search_service import search_image
from PIL import Image
import io

router = APIRouter()

@router.post("/start-pipeline")
def start_pipeline():
    """
    API Endpoint to manually trigger the embedding generation and FAISS indexing
    pipeline for unindexed raw images.
    """
    try:
        run_indexing_pipeline()
        return {
            "status": "Pipeline started successfully"
        }
    except Exception as e:
        return {
            "status": "Pipeline failed",
            "error": str(e)
        }

@router.post("/search-image")
async def search_image_endpoint(file: UploadFile = File(...)):
    """
    API Endpoint to accept an image upload, process it completely in-memory, 
    search the FAISS index, and return SAFE or FOUND along with metadata.
    Does NOT store the image permanently.
    """
    if not file.content_type.startswith("image/"):
        return {
            "status": "ERROR", 
            "message": "Search failed: Invalid file type. Must be an image."
        }
        
    try:
        # Read file bytes in memory
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Perform search
        result = search_image(image, threshold=0.78)
        return result
        
    except Exception as e:
        return {
            "status": "ERROR",
            "message": f"Search failed: {str(e)}"
        }
