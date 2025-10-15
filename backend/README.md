# 🐄 PashuSuchak AI Backend

Production-ready FastAPI backend for AI-powered cattle breed identification with RAG explanations.

## 🚀 Features

- **Roboflow Integration**: Advanced cattle detection and breed classification
- **RAG System**: AI explanations using OpenAI GPT-4o-mini with breed knowledge base
- **File Upload**: Secure image upload and processing
- **CORS Support**: Ready for frontend integration
- **Error Handling**: Comprehensive error handling and logging
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

## 📁 Project Structure

```
backend/
├── main.py                          # FastAPI server
├── requirements.txt                 # Python dependencies
├── env.example                      # Environment variables template
├── README.md                        # This file
├── models/
│   ├── __init__.py
│   ├── roboflow_inference.py        # Roboflow model integration
│   ├── rag_helper.py                # RAG system with OpenAI
│   └── knowledge/
│       └── breed_knowledge.txt      # Breed knowledge base
└── uploads/                         # Temporary file storage
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy the example environment file and configure your API keys:

```bash
cp env.example .env
```

Edit `.env` and add your actual API keys:

```bash
# Replace with your actual OpenAI API key
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Replace with your actual Roboflow API keys
ROBOFLOW_API_KEY_DETECT=your-detection-api-key
ROBOFLOW_API_KEY_BREED=your-breed-api-key
```

### 3. Start the Server

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🔧 API Endpoints

### POST `/predict/`
Upload an image for breed identification.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
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

### GET `/`
Health check endpoint.

### GET `/health`
Detailed health check with service status.

## 🔑 API Keys Required

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add it to your `.env` file

### Roboflow API Keys
1. Go to [Roboflow](https://roboflow.com/)
2. Create an account and access your models
3. Get your API keys from the dashboard
4. Add them to your `.env` file

## 🧠 How It Works

1. **Image Upload**: User uploads cattle image via `/predict/` endpoint
2. **Detection**: Roboflow models detect and classify the animal
3. **Breed Prediction**: AI predicts the breed with confidence score
4. **RAG Analysis**: If confidence is low (<0.7), RAG system generates explanation
5. **Response**: Returns prediction, confidence, and AI explanation

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for RAG | Required |
| `ROBOFLOW_API_KEY_DETECT` | Roboflow detection API key | Required |
| `ROBOFLOW_API_KEY_BREED` | Roboflow breed API key | Required |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `DEBUG` | Debug mode | `True` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `10485760` (10MB) |

### CORS Configuration

The server is configured to allow all origins in development. For production, update the CORS settings in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],  # Production URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Error**
   - Check your API key is correct
   - Ensure you have sufficient credits
   - Verify the key has GPT-4 access

2. **Roboflow Connection Error**
   - Verify your API keys are correct
   - Check if the models are accessible
   - Ensure you have sufficient API credits

3. **File Upload Issues**
   - Check file size (max 10MB)
   - Verify file format (jpg, png, gif, bmp, webp)
   - Ensure uploads directory exists

4. **Import Errors**
   - Run `pip install -r requirements.txt`
   - Check Python version (3.8+ required)
   - Verify all dependencies are installed

### Debug Mode

Enable debug mode by setting `DEBUG=True` in your `.env` file. This will:
- Show detailed error messages
- Enable verbose logging
- Display additional information in responses

## 📊 Monitoring

### Health Check
Visit `/health` to check the status of all services:
- Roboflow connection status
- OpenAI connection status
- RAG system status

### Logs
The application logs important events:
- Image processing status
- API call results
- Error messages
- Performance metrics

## 🚀 Production Deployment

### Using Docker (Recommended)

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t pashusuchak-backend .
docker run -p 8000:8000 --env-file .env pashusuchak-backend
```

### Using PM2

```bash
npm install -g pm2
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name pashusuchak-backend
```

## 🤝 Integration with Frontend

This backend is designed to work seamlessly with the PashuSuchak frontend. The frontend should:

1. Send POST requests to `/predict/` with image files
2. Handle the response format as shown above
3. Display breed predictions, confidence scores, and RAG explanations
4. Show clarifying questions when confidence is low

## 📝 License

This project is part of the PashuSuchak AI system for cattle breed identification.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation at `/docs`
3. Check the logs for error messages
4. Verify all API keys are correctly configured
