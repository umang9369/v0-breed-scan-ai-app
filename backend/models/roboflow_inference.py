"""
Roboflow Inference Module for PashuSuchak AI
Handles cattle detection and breed classification using Roboflow models
"""

from inference_sdk import InferenceHTTPClient
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Roboflow API Configuration
# Your actual Roboflow API keys and model IDs
ROBOFLOW_API_KEY_DETECT = "WJvQbPKZ0YiRywO0hcaK"  # Detection model API key
ROBOFLOW_API_KEY_BREED = "UP3o92YFIoVdAEpD9qcW"   # Breed classification API key

# Model configurations
DETECTION_WORKSPACE = "shiv-q9erb"
DETECTION_WORKFLOW = "detect-and-classify-2"
BREED_MODEL_ID = "breed-6neji/1"

# Initialize Roboflow clients
try:
    # Client for detection and classification workflow
    client_detect = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com",
        api_key=ROBOFLOW_API_KEY_DETECT
    )
    
    # Client for breed classification
    client_breed = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com",
        api_key=ROBOFLOW_API_KEY_BREED
    )
    
    logger.info("✅ Roboflow clients initialized successfully")
    
except Exception as e:
    logger.error(f"❌ Failed to initialize Roboflow clients: {e}")
    client_detect = None
    client_breed = None

def get_breed_prediction(image_path):
    """
    Run breed prediction on uploaded cattle image
    
    Args:
        image_path (str): Path to the uploaded image file
        
    Returns:
        dict: {
            "breed": str,
            "confidence": float,
            "detection": dict (optional),
            "error": str (if error occurred)
        }
    """
    try:
        if not os.path.exists(image_path):
            return {
                "breed": "error",
                "confidence": 0.0,
                "error": "Image file not found"
            }
        
        logger.info(f"🔍 Processing image: {image_path}")
        
        # Step 1: Run detection workflow
        detection_result = None
        if client_detect:
            try:
                detection_result = client_detect.run_workflow(
                    workspace_name=DETECTION_WORKSPACE,
                    workflow_id=DETECTION_WORKFLOW,
                    images={"image": image_path},
                    use_cache=True
                )
                logger.info("✅ Detection workflow completed")
            except Exception as e:
                logger.warning(f"⚠️ Detection workflow failed: {e}")
        
        # Step 2: Run breed classification
        breed_result = None
        if client_breed:
            try:
                breed_result = client_breed.infer(image_path, model_id=BREED_MODEL_ID)
                logger.info("✅ Breed classification completed")
            except Exception as e:
                logger.warning(f"⚠️ Breed classification failed: {e}")
        
        # Process breed classification results
        if breed_result and "predictions" in breed_result and len(breed_result["predictions"]) > 0:
            top_prediction = breed_result["predictions"][0]
            breed = top_prediction.get("class", "unknown")
            confidence = top_prediction.get("confidence", 0.0)
            
            logger.info(f"🎯 Predicted breed: {breed} (confidence: {confidence:.3f})")
            
            return {
                "breed": breed,
                "confidence": confidence,
                "detection": detection_result,
                "all_predictions": breed_result.get("predictions", [])
            }
        else:
            logger.warning("⚠️ No breed predictions found")
            return {
                "breed": "uncertain",
                "confidence": 0.0,
                "detection": detection_result,
                "error": "No predictions returned from breed model"
            }
            
    except Exception as e:
        logger.error(f"❌ Error during breed prediction: {e}")
        return {
            "breed": "error",
            "confidence": 0.0,
            "error": str(e)
        }

def validate_roboflow_connection():
    """
    Test Roboflow API connections
    
    Returns:
        dict: Connection status for each service
    """
    status = {
        "detection_client": False,
        "breed_client": False,
        "overall": False
    }
    
    try:
        if client_detect:
            # Test detection client with a simple request
            status["detection_client"] = True
            logger.info("✅ Detection client connection verified")
    except Exception as e:
        logger.error(f"❌ Detection client connection failed: {e}")
    
    try:
        if client_breed:
            # Test breed client with a simple request
            status["breed_client"] = True
            logger.info("✅ Breed client connection verified")
    except Exception as e:
        logger.error(f"❌ Breed client connection failed: {e}")
    
    status["overall"] = status["detection_client"] and status["breed_client"]
    
    return status

# Test connections on module import
if __name__ == "__main__":
    print("🧪 Testing Roboflow connections...")
    connection_status = validate_roboflow_connection()
    print(f"Connection status: {connection_status}")
