from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import uuid
from datetime import datetime
import requests
import json

app = FastAPI(
    title="PashuSuchak AI Backend",
    description="AI-powered cattle breed identification",
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
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)

def call_roboflow_detection(image_path):
    """Call Roboflow detection API"""
    try:
        # Roboflow API 1: Detection
        url = "https://serverless.roboflow.com/detect-and-classify-2"
        headers = {
            "Authorization": "Bearer WJvQbPKZ0YiRywO0hcaK"
        }
        
        with open(image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(url, headers=headers, files=files)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Detection API error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Detection error: {e}")
        return None

def call_roboflow_breed(image_path):
    """Call Roboflow breed classification API"""
    try:
        # Roboflow API 2: Breed Classification
        url = "https://serverless.roboflow.com/breed-6neji/1"
        headers = {
            "Authorization": "Bearer UP3o92YFIoVdAEpD9qcW"
        }
        
        with open(image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(url, headers=headers, files=files)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Breed API error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Breed classification error: {e}")
        return None

def call_openai_explanation(breed, confidence):
    """Call OpenAI for explanation"""
    try:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert veterinary AI assistant specializing in Indian cattle breeds. Provide clear, helpful explanations about breed identification."
                },
                {
                    "role": "user",
                    "content": f"Explain the breed '{breed}' with confidence {confidence:.2f}. Provide information about its characteristics, origin, and uses."
                }
            ],
            "max_tokens": 300
        }
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            print(f"OpenAI API error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"OpenAI error: {e}")
        return None

@app.post("/predict/")
async def predict_breed(file: UploadFile = File(...)):
    """
    Handles cattle image upload and runs AI analysis
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
        
        # Step 1: Run Roboflow detection
        detection_result = call_roboflow_detection(file_path)
        
        # Step 2: Run Roboflow breed classification
        breed_result = call_roboflow_breed(file_path)
        
        # Process results
        breed = "unknown"
        confidence = 0.0
        
        if breed_result and "predictions" in breed_result and len(breed_result["predictions"]) > 0:
            top_prediction = breed_result["predictions"][0]
            breed = top_prediction.get("class", "unknown")
            confidence = top_prediction.get("confidence", 0.0)
        
        # Step 3: Generate explanation if confidence is low
        rag_response = None
        clarifying_questions = None
        
        if confidence < 0.7:
            print("Low confidence detected, generating explanation...")
            rag_response = call_openai_explanation(breed, confidence)
            
            if confidence < 0.5:
                clarifying_questions = (
                    "The AI is uncertain about this breed. Could you provide more details about:\n"
                    "• The animal's size and build\n"
                    "• Any distinctive markings or colors\n"
                    "• The region where this animal is from\n"
                    "• Any known parentage or breeding history"
                )
        
        # Prepare response
        response = {
            "detection": detection_result or {},
            "breed_prediction": {
                "breed": breed,
                "confidence": confidence
            },
            "rag_response": rag_response,
            "clarifying_questions": clarifying_questions,
            "timestamp": datetime.now().isoformat(),
            "file_processed": unique_filename
        }
        
        # Clean up uploaded file
        try:
            os.remove(file_path)
        except:
            pass
        
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
        "message": "PashuSuchak AI Backend is running successfully!",
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
            "roboflow_detection": "configured",
            "roboflow_breed": "configured", 
            "openai": "configured"
        }
    }

if __name__ == "__main__":
    print("Starting PashuSuchak AI Backend...")
    print("Backend will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
