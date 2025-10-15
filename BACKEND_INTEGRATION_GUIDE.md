# 🐄 PashuSuchak AI Backend Integration Guide

Complete guide to set up and integrate the PashuSuchak AI backend with your frontend.

## 📁 Backend Structure Created

```
backend/
├── main.py                          # FastAPI server with CORS
├── start.py                         # Startup script with checks
├── requirements.txt                 # All dependencies
├── env.example                      # Environment template
├── setup.bat                        # Windows setup script
├── setup.sh                         # Linux/Mac setup script
├── README.md                        # Detailed documentation
├── models/
│   ├── __init__.py
│   ├── roboflow_inference.py        # Roboflow integration
│   ├── rag_helper.py                # OpenAI RAG system
│   └── knowledge/
│       └── breed_knowledge.txt      # Comprehensive breed database
└── uploads/                         # Temporary file storage
```

## 🚀 Quick Start (Windows)

1. **Navigate to backend directory:**
   ```cmd
   cd backend
   ```

2. **Run setup script:**
   ```cmd
   setup.bat
   ```

3. **Configure API keys:**
   - Edit `.env` file
   - Add your OpenAI API key
   - Add your Roboflow API keys

4. **Start the server:**
   ```cmd
   python start.py
   ```

## 🚀 Quick Start (Linux/Mac)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Run setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure API keys:**
   - Edit `.env` file
   - Add your API keys

4. **Start the server:**
   ```bash
   python start.py
   ```

## 🔑 Required API Keys

### 1. OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/)
- Create account and get API key
- Add to `.env`: `OPENAI_API_KEY=sk-your-key-here`

### 2. Roboflow API Keys
- Go to [Roboflow](https://roboflow.com/)
- Access your models dashboard
- Get API keys for detection and breed models
- Add to `.env`:
  ```
  ROBOFLOW_API_KEY_DETECT=your-detection-key
  ROBOFLOW_API_KEY_BREED=your-breed-key
  ```

## 🔧 Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Install dependencies
pip install -r requirements.txt

# Create directories
mkdir uploads
mkdir models/knowledge

# Copy environment template
cp env.example .env

# Edit .env with your API keys
# Then start server
python start.py
```

## 🌐 Server Endpoints

Once running, your backend will be available at:

- **Main API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Predict Endpoint**: http://localhost:8000/predict/

## 🔗 Frontend Integration

Your frontend is already configured to connect to this backend! The frontend will:

1. Send POST requests to `http://localhost:8000/predict/`
2. Upload images as `multipart/form-data`
3. Receive JSON responses with:
   - Breed prediction and confidence
   - RAG explanations (when uncertain)
   - Clarifying questions (when needed)

## 📊 API Response Format

```json
{
  "detection": { /* detection results */ },
  "breed_prediction": {
    "breed": "Sahiwal",
    "confidence": 0.85
  },
  "rag_response": "This appears to be a Sahiwal cattle...",
  "clarifying_questions": "Could you provide more details...",
  "timestamp": "2024-01-15T10:30:00",
  "file_processed": "uuid-filename.jpg"
}
```

## 🧠 How the AI Works

1. **Image Upload**: User uploads cattle image
2. **Detection**: Roboflow detects and classifies the animal
3. **Breed Prediction**: AI predicts breed with confidence score
4. **RAG Analysis**: If confidence < 0.7, generates AI explanation
5. **Response**: Returns prediction + explanation + questions

## 🐛 Troubleshooting

### Common Issues:

1. **"OpenAI API Error"**
   - Check your API key is correct
   - Ensure you have GPT-4 access
   - Verify sufficient credits

2. **"Roboflow Connection Error"**
   - Verify API keys are correct
   - Check model accessibility
   - Ensure sufficient API credits

3. **"Import Errors"**
   - Run `pip install -r requirements.txt`
   - Check Python version (3.8+ required)

4. **"File Upload Issues"**
   - Check file size (max 10MB)
   - Verify file format (jpg, png, gif, bmp, webp)

### Debug Mode:
Set `DEBUG=True` in `.env` for detailed error messages.

## 🚀 Production Deployment

### Using Docker:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using PM2:
```bash
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name pashusuchak-backend
```

## 📈 Monitoring

- **Health Check**: Visit `/health` for service status
- **Logs**: Check console output for processing status
- **API Docs**: Visit `/docs` for interactive API testing

## 🔒 Security Notes

- Update CORS settings for production
- Use environment variables for API keys
- Implement rate limiting for production
- Add authentication if needed

## 🎯 Next Steps

1. **Test the Integration**: Upload cattle images and verify responses
2. **Customize Knowledge Base**: Edit `breed_knowledge.txt` for your region
3. **Optimize Performance**: Adjust confidence thresholds as needed
4. **Add Features**: Consider adding batch processing, history, etc.

## 📞 Support

- Check the backend `README.md` for detailed documentation
- Review API documentation at `/docs` when server is running
- Check logs for error messages
- Verify all API keys are correctly configured

---

**🎉 Your PashuSuchak AI system is now ready!** 

The backend provides intelligent breed identification with AI explanations, and your frontend is already configured to use it seamlessly.
