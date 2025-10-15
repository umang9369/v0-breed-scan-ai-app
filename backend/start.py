#!/usr/bin/env python3
"""
PashuSuchak AI Backend Startup Script
Simple script to start the FastAPI server with proper configuration
"""

import os
import sys
import uvicorn
from pathlib import Path

def check_environment():
    """Check if required environment variables are set"""
    required_vars = [
        'OPENAI_API_KEY',
        'ROBOFLOW_API_KEY_DETECT', 
        'ROBOFLOW_API_KEY_BREED'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var) or os.getenv(var) == f"your-{var.lower()}-here":
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n📝 Please set these in your .env file or environment")
        return False
    
    return True

def create_directories():
    """Create required directories"""
    directories = [
        "backend/uploads",
        "backend/models/knowledge"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Directory created: {directory}")

def main():
    """Main startup function"""
    print("🐄 Starting PashuSuchak AI Backend...")
    print("=" * 50)
    
    # Check environment
    if not check_environment():
        print("\n💡 To fix this:")
        print("1. Copy env.example to .env")
        print("2. Edit .env with your actual API keys")
        print("3. Run this script again")
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Start server
    print("\n🚀 Starting FastAPI server...")
    print("📡 Backend will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("❤️  Health Check: http://localhost:8000/health")
    print("\n" + "=" * 50)
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Shutting down PashuSuchak AI Backend...")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
