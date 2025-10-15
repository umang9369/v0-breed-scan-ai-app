@echo off
echo 🐄 PashuSuchak AI Backend Setup
echo ================================

echo.
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

echo.
echo 📁 Creating directories...
if not exist "uploads" mkdir uploads
if not exist "models\knowledge" mkdir models\knowledge

echo.
echo 📝 Setting up environment file...
if not exist ".env" (
    copy env.example .env
    echo ✅ Created .env file from template
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file and add your API keys:
    echo    - OPENAI_API_KEY
    echo    - ROBOFLOW_API_KEY_DETECT  
    echo    - ROBOFLOW_API_KEY_BREED
    echo.
    echo 📖 See README.md for detailed instructions
) else (
    echo ✅ .env file already exists
)

echo.
echo 🚀 Setup complete! 
echo.
echo To start the server:
echo   python start.py
echo.
echo Or directly:
echo   uvicorn main:app --reload
echo.
pause
