import os
import sys

# Add project root to python path to allow running directly
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.routes import router

app = FastAPI(title="HerSafe Space Backend API")

# Add CORS so React dev server can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev; tightly couple for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the endpoints
app.include_router(router)

# Serve matched images as static files so the frontend can display them
RAW_IMAGES_DIR = os.path.join(PROJECT_ROOT, 'data', 'raw_images')
if os.path.exists(RAW_IMAGES_DIR):
    app.mount("/matched-images", StaticFiles(directory=RAW_IMAGES_DIR), name="matched-images")

if __name__ == "__main__":
    import uvicorn
    # Start the backend API locally on port 8000
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
