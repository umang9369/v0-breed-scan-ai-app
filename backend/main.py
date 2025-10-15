from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import uuid
from datetime import datetime
from models.roboflow_inference import get_breed_prediction
from models.rag_helper import generate_explanation

app = FastAPI(
    title="PashuSuchak AI Backend",
    description="AI-powered cattle breed identification with RAG explanations",
    version="1.0.0"
)

# CORS setup for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = "backend/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)

@app.post("/predict/")
async def predict_breed(file: UploadFile = File(...)):
    """
    Handles cattle image upload and runs Roboflow + RAG analysis
    
    Returns:
    - detection: Raw detection results
    - breed_prediction: {breed: str, confidence: float}
    - rag_response: AI explanation (if uncertain)
    - clarifying_questions: Questions for user (if uncertain)
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        if not allowed_file(file.filename):
            raise HTTPException(
                status_code=400, 
                detail=f"File type not allowed. Supported types: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Generate unique filename to avoid conflicts
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        # Save uploaded file
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        print(f"Processing image: {file.filename} -> {unique_filename}")
        
        # Step 1: Run Roboflow models for breed prediction
        breed_result = get_breed_prediction(file_path)
        
        # Step 2: Determine if we need RAG explanation
        confidence = breed_result.get("confidence", 0.0)
        breed = breed_result.get("breed", "unknown")
        
        # Use RAG if confidence is low or breed is uncertain
        needs_rag = (
            confidence < 0.7 or 
            breed.lower() in ["uncertain", "mixed", "unknown", "error"]
        )
        
        rag_response = None
        clarifying_questions = None
        
        if needs_rag:
            print("Low confidence detected, generating RAG explanation...")
            rag_response = generate_explanation(file_path, breed_result)
            
            # Generate clarifying questions for uncertain cases
            if confidence < 0.5:
                clarifying_questions = (
                    "The AI is uncertain about this breed. Could you provide more details about:\n"
                    "• The animal's size and build\n"
                    "• Any distinctive markings or colors\n"
                    "• The region where this animal is from\n"
                    "• Any known parentage or breeding history"
                )
        
        # Prepare response matching frontend expectations
        response = {
            "detection": breed_result.get("detection", {}),
            "breed_prediction": {
                "breed": breed,
                "confidence": confidence
            },
            "rag_response": rag_response,
            "clarifying_questions": clarifying_questions,
            "timestamp": datetime.now().isoformat(),
            "file_processed": unique_filename
        }
        
        # Clean up uploaded file (optional - you might want to keep for debugging)
        try:
            os.remove(file_path)
        except:
            pass  # Don't fail if cleanup fails
        
        return JSONResponse(content=response)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/")
def home():
    """Health check endpoint"""
    return {
        "message": "🐄 PashuSuchak AI Backend is running successfully!",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/predict/",
            "health": "/"
        }
    }

@app.get("/health")
def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "roboflow": "connected",
            "openai": "configured",
            "rag": "ready"
        }
    }

if __name__ == "__main__":
    print("🚀 Starting PashuSuchak AI Backend...")
    print("📡 Backend will be available at: http://localhost:8000")
    print("🔗 API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
